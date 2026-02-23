import io
import pyotp
import qrcode
import base64
from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash

# --- Configuration ---
app = Flask(__name__)
app.config['SECRET_KEY'] = 'dominion-osagie-2026'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///student_portal.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

# --- Database Model ---
class Student(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    mfa_secret = db.Column(db.String(32)) 
    mfa_enabled = db.Column(db.Boolean, default=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

@login_manager.user_loader
def load_user(user_id):
    return db.session.get(Student, int(user_id))

# --- Routes ---

@app.route('/', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
        
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        user = Student.query.filter_by(username=username).first()
        
        if user and user.check_password(password):
            session['pre_2fa_user_id'] = user.id
            
            # Smart Redirect: If they have MFA, verify it. If not, force setup.
            if user.mfa_enabled:
                return redirect(url_for('verify_2fa'))
            else:
                return redirect(url_for('setup_2fa'))
        else:
            flash('Invalid username or password')
            
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
        
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        confirm_password = request.form['confirm_password']

        if password != confirm_password:
            flash('Passwords do not match!')
            return redirect(url_for('register'))
        
        if Student.query.filter_by(username=username).first():
            flash('Username already taken.')
            return redirect(url_for('register'))

        new_user = Student(username=username)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        
        flash('Registration successful! Please login.')
        return redirect(url_for('login'))
        
    return render_template('register.html')

@app.route('/setup-2fa')
def setup_2fa():
    user_id = session.get('pre_2fa_user_id')
    if not user_id: return redirect(url_for('login'))
    
    user = db.session.get(Student, user_id)
    
    # --- DEFENSE MODE: Hard-Coded Secret ---
    # Ensures the phone and server always match for the demo.
    # In a real app, you would use: user.mfa_secret = pyotp.random_base32()
    if not user.mfa_secret:
        user.mfa_secret = "JBSWY3DPEHPK3PXP" 
        db.session.commit()
    
    totp = pyotp.TOTP(user.mfa_secret)
    provisioning_uri = totp.provisioning_uri(name=user.username, issuer_name="DominionPortal")
    
    # Generate QR Code
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(provisioning_uri)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    
    buf = io.BytesIO()
    img.save(buf)
    qr_code_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    
    return render_template('setup_2fa.html', qr_code=qr_code_base64, secret=user.mfa_secret)

@app.route('/enable-2fa', methods=['POST'])
def enable_2fa():
    user_id = session.get('pre_2fa_user_id')
    user = db.session.get(Student, user_id)
    otp = request.form.get('otp').strip()
    
    totp = pyotp.TOTP(user.mfa_secret)
    
    # Debugging Log
    print(f"DEBUG: Phone: {otp} | Server: {totp.now()}")

    # valid_window=2 allows for a 60-second time drift
    if totp.verify(otp, valid_window=2):
        user.mfa_enabled = True
        db.session.commit()
        login_user(user)
        session.pop('pre_2fa_user_id', None)
        return redirect(url_for('dashboard'))
    
    flash("Code Mismatch. Please check your authenticator.")
    return redirect(url_for('setup_2fa'))

@app.route('/verify-2fa', methods=['GET', 'POST'])
def verify_2fa():
    user_id = session.get('pre_2fa_user_id')
    if not user_id: return redirect(url_for('login'))
    
    if request.method == 'POST':
        user = db.session.get(Student, user_id)
        otp = request.form['otp'].strip()
        totp = pyotp.TOTP(user.mfa_secret)
        
        if totp.verify(otp, valid_window=2):
            login_user(user)
            session.pop('pre_2fa_user_id', None)
            return redirect(url_for('dashboard'))
        flash('Invalid Code.')
        
    return render_template('verify_2fa.html')

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', user=current_user)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('login'))

# --- Initialize DB ---
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        # Create test user if not exists
        if not Student.query.filter_by(username='student1').first():
            u = Student(username='student1')
            u.set_password('password123')
            db.session.add(u)
            db.session.commit()
            print("Test User 'student1' Created.")
            
    app.run(debug=True)