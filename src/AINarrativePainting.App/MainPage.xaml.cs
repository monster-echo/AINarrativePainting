using AINarrativePainting.App.Services;

namespace AINarrativePainting.App;

public partial class MainPage : ContentPage
{
    public MainPage(HybridWebviewTarget target)
    {
        InitializeComponent();
        
        hybridWebView.SetInvokeJavaScriptTarget(target);
    }
}
