using System.ComponentModel.DataAnnotations;

namespace Hali.Api.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required, StringLength(100)]
        public string FullName { get; set; } = string.Empty;
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        public int DeptId { get; set; } // Simplified for now
        
        // Navigation properties
        public ICollection<HaliTask> AssignedTasks { get; set; } = new List<HaliTask>();
    }
}