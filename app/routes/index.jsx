import { Form, redirect, useLoaderData, useLocation } from 'remix'

export async function action({ request }) {
  let form = await request.formData()
  if (form.get('_method') === 'delete') {
    console.log(form.getAll('delete_data'))
    const toDelete = form.getAll('delete_data')
    await Promise.all(toDelete.map(async key => await MYDATA.delete(key)))
    return redirect('/')
  } else {
    let key = form.get('key')
    let value = form.get('value')
    await MYDATA.put(key, value)
    return redirect('/')
  }
}

export async function loader() {
  return await MYDATA.list()
}

export default function Index() {
  const { keys } = useLoaderData()
  const location = useLocation()
  return (
    <div>
      <h1>Cloudflare Workers on Remix</h1>
      <section>
        <Form id="dataForm" method="post" key={location.key}>
          <div>
            <label>
              <span className="key">Key:</span>
              <input type="text" name="key" />
            </label>
          </div>
          <div>
            <label>
              <span className="key">Value:</span>
              <textarea rows="4" cols="50" name="value" />
            </label>
          </div>
          <div>
            <input type="submit" value="Post" />
          </div>
        </Form>
      </section>
      <hr />
      <Form method="post" key={location.key}>
        <input type="hidden" name="_method" value="delete" />
        <ul>
          {keys.map(k => (
            <li key={k.name}>
              <input type="checkbox" name="delete_data" value={k.name} />
              <a href={`${k.name}.json`}>{k.name}</a>
            </li>
          ))}
        </ul>
        <input type="submit" value="Delete" />
      </Form>
    </div>
  )
}
