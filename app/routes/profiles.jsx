import {
  Form,
  Outlet,
  redirect,
  useLoaderData,
  useLocation,
  useTransition
} from 'remix'

export async function action({ request }) {
  let form = await request.formData()
  if (form.get('_method') === 'delete') {
    let toDelete = form.getAll('delete_data')
    await Promise.all(toDelete.map(async key => await MYDATA.delete(key)))
    return redirect('/profiles')
  }
}

export async function loader() {
  return await MYDATA.list()
}

export default function Profiles() {
  let { keys } = useLoaderData()
  let location = useLocation()
  let transition = useTransition()
  return (
    <div>
      <h1>Profiles</h1>
      <Form method="post" key={location.key}>
        <input type="hidden" name="_method" value="delete" />
        <ul>
          {keys.map(k => (
            <li key={k.name}>
              <input type="checkbox" name="delete_data" value={k.name} />
              <a href={`profiles/${k.name}.json`} target="_blank">
                {k.name}
              </a>
            </li>
          ))}
        </ul>
        <button type="submit" disabled={transition.submission}>
          {transition.submission ? 'Deleting...' : 'Delete'}
        </button>
      </Form>
      <hr />
      <Outlet />
    </div>
  )
}
