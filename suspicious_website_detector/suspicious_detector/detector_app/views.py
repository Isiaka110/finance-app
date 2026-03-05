from django.shortcuts import render
from .utils import hybrid_detect

def index(request):
    context = {}

    if request.method == "POST":
        url = request.POST.get("url")

        result = hybrid_detect(url)

        context = {
            "url": url,
            "final_result": result["final_result"],
            "ml_result": result["ml_result"],
            "score": result["score"],
            "reason": result["reason"]
        }

    return render(request, "detector_app/index.html", context)
