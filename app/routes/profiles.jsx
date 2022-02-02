import { Outlet, redirect, useFetcher, useLoaderData } from 'remix'

export async function action({ request }) {
  let formData = await request.formData()
  let { _action, key } = Object.fromEntries(formData)
  if (_action === 'delete') {
    await MYDATA.delete(key)
    return redirect('/profiles')
  }
}

export async function loader() {
  return await MYDATA.list()
}

export default function Profiles() {
  let { keys } = useLoaderData()
  return (
    <div>
      <h1>Profiles</h1>
      <ul>
        {keys.map(k => (
          <KeyItem k={k} key={k.name} />
        ))}
      </ul>
      <hr />
      <Outlet />
    </div>
  )
}

function KeyItem({ k }) {
  let fetcher = useFetcher()
  let isDeleting = fetcher.submission?.formData.get('key') === k.name
  return (
    <li
      key={k.name}
      style={{
        opacity: isDeleting ? 0.25 : 1
      }}
    >
      <a href={`profiles/${k.name}.json`} target="_blank">
        {k.name}
      </a>
      <fetcher.Form style={{ display: 'inline' }} method="post">
        <input type="hidden" name="key" value={k.name} />
        <button
          type="submit"
          aria-label="delete"
          disabled={isDeleting}
          name="_action"
          value="delete"
        >
          x
        </button>
      </fetcher.Form>
    </li>
  )
}
