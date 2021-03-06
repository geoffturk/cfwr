import {
  Form,
  redirect,
  useCatch,
  useFetcher,
  useLoaderData,
  useTransition
} from 'remix'
import { useEffect, useRef } from 'react'

export async function action({ request }) {
  let formData = await request.formData()
  let { _action, ...data } = Object.fromEntries(formData)
  if (_action === 'delete') {
    try {
      await MYDATA.delete(data.key)
      return redirect('/profiles')
    } catch (error) {
      console.error(error)
      throw new Response(
        'Could not delete data from KV store. Please try again.',
        {
          status: 500
        }
      )
    }
  }
  if (_action === 'create') {
    try {
      await MYDATA.put(data.key, data.value)
      return redirect('/profiles')
    } catch (error) {
      console.error(error)
      throw new Response(
        'Could not add new data to KV store. Please try again.',
        {
          status: 500
        }
      )
    }
  }
  return null
}

export async function loader() {
  return await MYDATA.list()
}

export default function Profiles() {
  let { keys } = useLoaderData()
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
      <h1>Profiles</h1>
      <ul>
        {keys.map(k => (
          <KeyItem k={k} key={k.name} />
        ))}
      </ul>
      <hr />
      <h2>New Profile</h2>
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

function KeyItem({ k }) {
  let fetcher = useFetcher()
  let isDeleting = fetcher.submission?.formData.get('key') === k.name
  let isFailedDeletion = fetcher.data?.error
  return (
    <li
      key={k.name}
      hidden={isDeleting}
      style={{ backgroundColor: isFailedDeletion ? 'red' : '' }}
    >
      <a href={`profiles/${k.name}.json`} target="_blank">
        {k.name}
      </a>
      <fetcher.Form style={{ display: 'inline' }} method="post">
        <input type="hidden" name="key" value={k.name} />
        <button
          type="submit"
          aria-label={isFailedDeletion ? 'retry' : 'delete'}
          disabled={isDeleting}
          name="_action"
          value="delete"
        >
          {isFailedDeletion ? 'Retry' : 'x'}
        </button>
      </fetcher.Form>
    </li>
  )
}

export function CatchBoundary() {
  const caught = useCatch()

  return (
    <div>
      <h1>There was an error!</h1>
      <h2>Status: {caught.status}</h2>
      <pre>
        <code>{JSON.stringify(caught.data, null, 2)}</code>
      </pre>
    </div>
  )
}
