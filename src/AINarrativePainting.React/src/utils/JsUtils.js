window.AddNumbers = (a, b) => {
  return {
    result: a + b,
    operation: "Addition",
  }
}

window.EvaluateMeWithParamsAndAsyncReturn = async function (s1, s2) {
  const response = await fetch("/asyncdata.txt")
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`)
  }
  var jsonData = await response.json()

  jsonData[s1] = s2

  const msg = "JSON data is available: " + JSON.stringify(jsonData)
  window.HybridWebView.SendRawMessage(msg)

  return jsonData
}
