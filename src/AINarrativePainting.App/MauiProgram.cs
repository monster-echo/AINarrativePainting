using AINarrativePainting.App.Services;
using CommunityToolkit.Maui;
using Microsoft.Extensions.Logging;
using Microsoft.Maui.Handlers;

#if WINDOWS
using Microsoft.UI.Xaml.Controls;
#endif

namespace AINarrativePainting.App
{
    public static class MauiProgram
    {
        public static MauiApp CreateMauiApp()
        {
            var builder = MauiApp.CreateBuilder();
            builder
                .UseMauiApp<App>()
                .ConfigureMauiHandlers(handlers =>
                {
                    handlers.AddHandler<HybridWebView, CustomHybridWebViewHandler>();
                })

                .UseMauiCommunityToolkit(options =>
                {
                    options.SetShouldEnableSnackbarOnWindows(true);
                })
                .ConfigureFonts(fonts =>
                {
                    fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                    fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
                });

#if DEBUG
            builder.Services.AddHybridWebViewDeveloperTools();
            builder.Logging.AddDebug();
#endif

            builder.Services.AddTransient<HybridWebviewTarget>();

            return builder.Build();
        }
    }

    public class CustomHybridWebViewHandler : HybridWebViewHandler
    {

#if WINDOWS
        protected override async void ConnectHandler(WebView2 platformView)
        {
            var webView2 = platformView.CoreWebView2;

            Microsoft.Web.WebView2.Core.CoreWebView2EnvironmentOptions options = new Microsoft.Web.WebView2.Core.CoreWebView2EnvironmentOptions();
            options.AdditionalBrowserArguments = "--disable-web-security --allow-running-insecure-content --disable-web-security-for-certificate";

            Microsoft.Web.WebView2.Core.CoreWebView2Environment
                environment = await Microsoft.Web.WebView2.Core.CoreWebView2Environment.CreateWithOptionsAsync
                (null, null, options);

            await platformView.EnsureCoreWebView2Async(environment);
            base.ConnectHandler(platformView);
        }
#endif

        //#if IOS || MACCATALYST
        //        protected override void ConnectHandler(WKWebView platformView)
        //        {
        //            base.ConnectHandler(platformView);
        //        }
        //#endif

#if ANDROID
        protected override void ConnectHandler(Android.Webkit.WebView platformView)
        {
            platformView.Settings.MixedContentMode = Android.Webkit.MixedContentHandling.AlwaysAllow;
            base.ConnectHandler(platformView);
        }
#endif
    }
}
