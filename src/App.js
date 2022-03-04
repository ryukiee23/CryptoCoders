import React, { useEffect, useState } from "react";
import CryptoCoders from "./contracts/CryptoCoders.json";
import "bootstrap/dist/css/bootstrap.min.css";
import Web3 from "web3";

const App = () => {
  const [account, setAccount] = useState("");
  const [loader, setloader] = useState(true);
  const [contract, setContract] = useState(null);
  const [mintText, setMintText] = useState("");
  const [coders, setCoders] = useState([]);

  useEffect(() => {
    const LoadWeb3 = async () => {
      setloader(true);
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = window.web3;
        console.log(web3);
        const accounts = await web3.eth.getAccounts();
        console.log(accounts);
        setAccount(accounts[0]);
        const networkId = await web3.eth.net.getId();
        const networkdata = CryptoCoders.networks[networkId];
        if(networkdata){
          const contract = new web3.eth.Contract(
            CryptoCoders.abi,
            networkdata.address
          );
          setContract(contract);
        }
        else{
          window.alert("This contract is not deployed to current network.")
          return;
        }
      } else {
        window.alert("Please Install MetaMask!");
      }
      setloader(false);
    };
    LoadWeb3();
  }, []);

  const mint = async () => {
    contract.methods.mint(mintText).send({ from: account }, (error) => {
      console.log("It worked");
      if (!error) {
        setCoders([...coders, mintText]);
        setMintText("");
      }
    });
  };

  if (loader) {
    return (
      <>
        <h3>Loading...</h3>
      </>
    );
  }

  return (
    <div>
      {/* Navbar Start */}
      <nav className="navbar navbar-light bg-light px-4">
        <a className="navbar-brand" href="#">
          CryptoCoders
        </a>
        <span>{account ? account : <span>Account Address</span>}</span>
      </nav>
      {/* Navbar Ends */}

      {/* Buttons and other things Start */}
      <div className="container-fluid mt-5">
        <div className="row">
          <div className="col d-flex flex-column align-items-center">
            <img
              className="mb-4"
              src="https://avatars.dicebear.com/api/pixel-art/naz.svg"
              alt=""
              width="72"
            />
            <h1 className="display-5 fw-bold">Crypto Coders</h1>
            <div className="col-6 text-center mb-3">
              <p className="lead text-center">
                These are some of the most highly motivated coders in the world!
                We are here to learn coding and apply it to the betterment of
                humanity. We are inventors, innovators, and creators
              </p>
              <div>
                <input
                  type="text"
                  placeholder="e.g. Arpit"
                  value={mintText}
                  onChange={(e) => setMintText(e.target.value)}
                  className="form-control mb-2"
                />

                <button className="btn btn-primary" onClick={mint}>
                  Mint
                </button>
              </div>
            </div>
            {/* buttons and other things end */}
            <div className="col-8 d-flex justify-content-center flex-wrap">
              {coders.map((coder, key) => (
                <div
                  className="d-flex flex-column align-items-center"
                  key={key}
                >
                  <img
                    width="150"
                    src={`https://avatars.dicebear.com/api/adventurer/${coder}.svg`}
                  />
                  <span>{coder}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
