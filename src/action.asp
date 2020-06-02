<%
  timestamp = request("timestamp")
  toUser = request("toUser")
  subject = request("subject")
  html = request("html")
  
  dir = "D:\edm\" & timestamp

  set fs = Server.CreateObject("Scripting.FilesystemObject")
  set doc = Server.CreateObject("MSXML2.DOMDocument")
  set nodeB64 = doc.CreateElement("b64")
  nodeB64.DataType = "bin.base64"

  set bStream = Server.CreateObject("ADODB.stream")
  bStream.type = 1

  if Not fs.FolderExists(dir) then
    dir = fs.CreateFolder(dir)
  end if

  for i = 1 to request("dataurl").count
    nodeB64.Text = request("dataurl")(i)
    bStream.Open()
    bStream.Write(nodeB64.NodeTypedValue)
    bStream.SaveToFile dir & "\" & request("filename")(i) & ".png"
    bStream.close()
  next
  
  set bStream = nothing

  set objMessage = createobject("cdo.message")
  set objConfig = createobject("cdo.configuration")

  set Flds = objConfig.Fields
  Flds.item("http://schemas.microsoft.com/cdo/configuration/sendusing") = 2
  '-> 서버 접근방법을 설정합니다
  Flds.item("http://schemas.microsoft.com/cdo/configuration/smtpserver") = ""
  '-> 서버 주소를 설정합니다
  'Flds.item("http://schemas.microsoft.com/cdo/configuration/smtpserverport") = 25
  '-> 접근할 포트번호를 설정합니다
  Flds.item("http://schemas.microsoft.com/cdo/configuration/smtpconnectiontimeout") = 30
  '-> 접속시도할 제한시간을 설정합니다
  Flds.Item("http://schemas.microsoft.com/cdo/configuration/smtpauthenticate") = 1
  '-> SMTP 접속 인증방법을 설정합니다
  Flds.item("http://schemas.microsoft.com/cdo/configuration/sendusername") = ""
  '-> SMTP 서버에 인증할 ID를 입력합니다
  Flds.item("http://schemas.microsoft.com/cdo/configuration/sendpassword") = ""
  '-> SMTP 서버에 인증할 암호를 입력합니다
  Flds.update

  set objMessage.Configuration = objConfig

  'Mail_Dir = server.mappath("\")

  objMessage.To = toUser
  objMessage.From = "Fasoo <newsletter@fasoo.com>"
  objMessage.Subject = subject
  objMessage.HTMLBody = html
  '// objMessage.TextBody = "This is just text."
  objMessage.BodyPart.Charset = "utf-8"
  objMessage.fields.update
  objMessage.Send

  set objMessage = Nothing
  set objConfig = Nothing  
%>
<script>alert('메일을 전송하였습니다.')</script>