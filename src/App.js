import React, { useEffect, useReducer } from 'react'
import { API } from 'aws-amplify'
import { List } from 'antd'
import 'antd/dist/antd.css'
import { listNotes } from './graphql/queries'

const initialState = {
  notes: [],
  loading: true,
  error: false,
  form: { name: '', description: '' }
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTES':
      return { ...state, notes: action.notes, loading: false }
    case 'ERROR':
      return { ...state, loading: false, error: true }
    default:
      return state
  }
}
const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const fetchNotes = async () => {
    try {
      const notesData = await API.graphql({
        query: listNotes
      })
      console.log(notesData)
      dispatch({ type: 'SET_NOTES', notes: notesData.data.listNotes.items })
    }
    catch (err) {
      console.log('error: ', err)
      dispatch({ type: 'ERROR' })
    }
  }
  useEffect(() => {
    fetchNotes()
  }, [])
  return (
    <div style={styles.container}>
      <List
        loading={state.loading}
        dataSource={state.notes}
        renderItem={renderItem}
      />
    </div>
  )
}

const renderItem = (item) => {
  return (
    <List.Item style={styles.item}>
      <List.Item.Meta
        title={item.name}
        description={item.description}
      />
    </List.Item>
  )
}

const styles = {
  container: { padding: 20 },
  input: { marginBottom: 10 },
  item: { textAlign: 'left' },
  p: { color: '#1890ff' }
}
export default App
