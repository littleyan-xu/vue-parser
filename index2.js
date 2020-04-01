const ncname = '[a-zA-Z_][\\w\\-\\.]*' // 标签名，名字第一个只能是字母或者下划线，所以需要分开写
const qnameCapture = `((?:${ncname}\\:)?(${ncname}))` // 匹配abc:abc模式，xml里面标签名前可加命名空间，如<html:body>，前面是惰性匹配（?:）,后面则捕获标签名
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 以<开头，后面跟标签名
const startTagClose = new RegExp('^\\s*(\\/)?>') // 这里主要是判断是否是自闭合标签，如果是则会匹配斜杠“/”
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 结束标签，以</开头，以>结尾

let html = '<div id="app" class="content">这是一段纯文本</div>'
console.log('未处理前的html:', html);

parseHTML()

function parseHTML(html) {
  // 循环处理
  while (html) {
    let textEnd = html.indexOf('<')
    // 以<开头
    if (textEnd === 0) {
      const startTagMatch = html.match(startTagOpen)
      //console.log(startTagMatch);

      // 如果匹配上开始标签
      if (startTagMatch) {
        const match = {
          tagName: startTagMatch[1],
          attrs: [],
        }
        html = html.substring(startTagMatch[0].length)
        console.log('处理完开始标签属性之后的html:', html);

        let startEnd, attr
        // 没有匹配上开始标签结束，且匹配到了属性
        while (!(startEnd = html.match(startTagClose)) && (attr = html.match(attribute))) {
          html = html.substring(attr[0].length)
          match.attrs.push(attr)
        }
        console.log('处理完属性之后的html:', html);
        //console.log('获取到的所有属性:', match.attrs);

        // 开始标签结束
        if (startEnd) {
          match.unarySlash = startEnd[1] // 保存自闭合标签的斜杠
          html = html.substring(startEnd[0].length)
        }
        console.log('处理完开始标签结束之后的html:', html);

        continue // 结束本轮循环
      }

      // 如果匹配上结束标签
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        html = html.substring(endTagMatch[0].length)
        console.log('处理完结束标签之后的html:', html);
        continue // 结束本轮循环
      }
    }

    // 剩下的就是文本和结束标签
    let text
    if (textEnd > 0) {
      text = html.substring(0, textEnd)
      html = html.substring(textEnd)
      console.log('获取到的文本是:', text);
      console.log('处理完文本之后的html:', html);
    }

    // 如果没有<，说明就是纯文本了
    if (textEnd < 0) {
      text = html
      html = ''
    }
  }
}


