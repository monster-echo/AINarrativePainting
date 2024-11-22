using AINarrativePainting.App.Services;
using Microsoft.Maui.Controls;
using System.Diagnostics;
using System.Text.Json.Serialization;

namespace AINarrativePainting.App;

public partial class MainPage : ContentPage
{
    int count = 0;

    public MainPage(HybridWebviewTarget target)
    {
        InitializeComponent();
        
        hybridWebView.SetInvokeJavaScriptTarget(target);
    }
}
