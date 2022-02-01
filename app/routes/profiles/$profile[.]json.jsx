import { json } from 'remix'

export async function loader({ params }) {
  let data = await MYDATA.get(params.profile)
  return json(await JSON.parse(data))
}
