import { Form, useActionData } from 'remix'

export async function action({ request }) {
  console.log('MYDATA', MYDATA)
  let body = await request.formData()
  let key = body.get('key')
  let val = body.get('val')
  await MYDATA.put(key, val)
  return new Response(await MYDATA.get(key))
}

export default function Index() {
  const data = useActionData()
  console.log('data', data)
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1>Cloudflare Workers on Remix</h1>
      <Form method="post">
        <label>
          Key:
          <input type="text" name="key" />
        </label>
        <label>
          Val:
          <input type="text" name="val" />
        </label>
        <input type="submit" value="Post" />
      </Form>
    </div>
  )
}
