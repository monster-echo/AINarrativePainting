interface HybridWebView {
  InvokeDotNet: (methodName: string, paramValues?: any[]) => Promise<any>
}

const invokeDotNetMethod = async (
  methodName: string,
  paramValues: any[] = []
): Promise<any> => {
  const win = window as unknown as { HybridWebView?: HybridWebView }
  if (win.HybridWebView) {
    const result = await win.HybridWebView.InvokeDotNet(methodName, paramValues)

    if (result.Result) {
      return result.Result
    }
  } else {
    throw new Error("HybridWebView is not available")
  }
}

// define a function to show toast invoking the .NET method
export const showToast = async (message: string): Promise<void> => {
  try {
    await invokeDotNetMethod("ShowToast", [message])
  } catch (error) {
    alert(message)
  }
}

// define a function to show snackbar invoking the .NET method
export const showSnackbar = async (message: string): Promise<void> => {
  try {
    await invokeDotNetMethod("ShowSnackbar", [message])
  } catch (error) {
    alert(message)
  }
}

// define a function to get string value from the .NET method
export const getStringValue = async (key: string): Promise<string> => {
  try {
    return await invokeDotNetMethod("GetStringValue", [key])
  } catch (error) {
    throw new Error("HybridWebView is not available")
  }
}

// define a function to set string value to the .NET method
export const setStringValue = async (
  key: string,
  value: string
): Promise<void> => {
  try {
    await invokeDotNetMethod("SetStringValue", [key, value])
  } catch (error) {
    throw new Error("HybridWebView is not available")
  }
}
