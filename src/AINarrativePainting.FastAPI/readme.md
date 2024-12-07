# AI Narrative Painting FastAPI

一个基于FastAPI的AI说画项目，通过调用AI模型生成一些有趣的图像。
这个项目提供一套API接口：

- 任务接口
1. 上传一段文本，将其转换为任务，返回任务ID，并把任务加入任务队列。
2. 查询任务状态，返回任务的状态。
3. 查询任务结果，返回任务的结果。

- 对话接口
1. 通过langchain库生成对话，返回对话结果。