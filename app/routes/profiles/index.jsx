import { Form, redirect, useLocation, useTransition } from 'remix'

export async function action({ request }) {
  let formData = await request.formData()
  let key = formData.get('key')
  let value = formData.get('value')
  await MYDATA.put(key, value)
  return redirect('/profiles')
}

export default function NewProfile() {
  let location = useLocation()
  let transition = useTransition()
  return (
    <div>
      <h1>New Profile</h1>
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
            <button type="submit" disabled={transition.submission}>
              {transition.submission ? 'Posting...' : 'Post'}
            </button>
          </div>
        </Form>
      </section>
    </div>
  )
}
