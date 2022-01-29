import { json } from 'remix'

export async function loader({ params }) {
  const data = await MYDATA.get(params.profile)
  return json(await JSON.parse(data))
}
