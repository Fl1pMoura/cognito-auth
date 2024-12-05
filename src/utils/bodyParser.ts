type Body = Record<string, any>

export default function bodyParser(body: string | undefined): Body { 
  let parsedBody = {}
  try {
   if (body) {
     parsedBody = JSON.parse(body);
   }
  } catch (e) {
    console.log(e);
  }
  return parsedBody;
}