import { useEffect, useRef } from 'react'
import { Form, redirect, useTransition } from 'remix'

export async function action({ request }) {
  let formData = await request.formData()
  let { _action, ...data } = Object.fromEntries(formData)
  if (_action === 'create') {
    await MYDATA.put(data.key, data.value)
    return redirect('/profiles')
  }
  return null
}

export default function NewProfile() {
  let transition = useTransition()
  let isAdding =
    transition.state === 'submitting' &&
    transition.submission.formData.get('_action') === 'create'
  let formRef = useRef()
  let keyRef = useRef()

  useEffect(() => {
    if (!isAdding) {
      formRef.current?.reset()
      keyRef.current?.focus()
    }
  }, [isAdding])

  return (
    <div>
      <h1>New Profile</h1>
      <section>
        <Form id="dataForm" method="post" ref={formRef}>
          <div>
            <label>
              <span className="key">Key:</span>
              <input type="text" name="key" ref={keyRef} />
            </label>
          </div>
          <div>
            <label>
              <span className="key">Value:</span>
              <textarea rows="4" cols="50" name="value" />
            </label>
          </div>
          <div>
            <button
              type="submit"
              disabled={isAdding}
              name="_action"
              value="create"
            >
              {isAdding ? 'Adding...' : 'Add'}
            </button>
          </div>
        </Form>
      </section>
    </div>
  )
}
