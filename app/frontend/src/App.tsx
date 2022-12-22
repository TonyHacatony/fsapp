import { useEffect, useState } from 'react';
import api from './util/api';
import { TestRequest, TestResponse } from '@lib/type';

function App() {

  const [health, setHealth] = useState('In progress...');
  const [value, setValue] = useState('');
  const [response, setResponse] = useState('');

  useEffect(() => {
    api.get('/').then((date) => setHealth(date.data));
  }, []);

  const inputId = 'test_input';

  const onClick = () => {
    const body: TestRequest = { body: value };
    api.post('/', body).then((res) => {
      const response: TestResponse = res.data;
      setResponse(response.response)
    });
  };

  const handleInputClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val: string = e.target.value;
    setValue(() => val);
  }

  return (
    <div>
      <h1>
        Health-status: {health}
      </h1>
      <label id={inputId}>Request</label>
      <input size={4} onChange={handleInputClick}></input>
      <button onClick={onClick}>Send response</button>
      <h2>Response: {response}</h2>
    </div>
  );
}

export default App;
