import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers';
import ErrorMessage from './ErrorMessage';
import TxList from './TxList';

async function simplePay(setError, setTransaction, address, ether) {
  setError('');
  try {
    if(window.ethereum) {

      await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()

      ethers.utils.getAddress(address);

      const tx = await signer.sendTransaction({
        to: address,
        value: ethers.utils.parseEther(ether)
      });

      setTransaction(tx.hash);
    } else {
        throw 'MetaMask not installed';
    }
  } catch(error) {
    setError(error.message);
  }
}

function App() {

  const [ error, setError ] = useState('');
  const [ transaction, setTransaction ] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    simplePay(setError, setTransaction, formData.get('address'), formData.get('ether'));
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <main>
          <h1>Simple Pay</h1>
          <input type="text" name="address"></input>
          <input type="text" name="ether"></input>
        </main>
        <footer>
          <button type="submit">
              Pay
          </button>
        </footer>
      </form>
      <ErrorMessage error={error} />
      <TxList transaction={transaction}/>
    </div>
  );
}

export default App;
