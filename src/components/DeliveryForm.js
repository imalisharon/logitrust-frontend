import React, { useState } from "react";
import { parseEther, isAddress } from "ethers";
import './DeliveryForm.css'; 

const DeliveryForm = ({ setQrData, getContract }) => {
  const [deliveryId, setDeliveryId] = useState("");
  const [status, setStatus] = useState("0");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [courierAddress, setCourierAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const createDelivery = async () => {
    if (!isAddress(recipientAddress) || !isAddress(courierAddress)) {
      setError("Invalid Ethereum addresses for recipient or courier.");
      return;
    }

    const contract = await getContract();
    setIsLoading(true);
    setError("");

    try {
      const tx = await contract.createDelivery(recipientAddress, courierAddress, {
        value: parseEther("0.1"),
      });
      await tx.wait();
      const count = await contract.deliveryCount();
      setQrData(`DeliveryId:${count}`);
    } catch (error) {
      setError(`Error creating delivery: ${error.message}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async () => {
    if (!deliveryId) {
      setError("Delivery ID cannot be empty.");
      return;
    }

    const contract = await getContract();
    setIsLoading(true);
    setError("");

    try {
      const tx = await contract.updateStatus(deliveryId, status);
      await tx.wait();
    } catch (error) {
      setError(`Error updating status: ${error.message}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="delivery-form-container">
      {error && <p className="error-message">{error}</p>}

      <h3>Create Delivery</h3>
      <input
        className="input-field"
        placeholder="Recipient Address"
        value={recipientAddress}
        onChange={(e) => setRecipientAddress(e.target.value)}
      />
      <input
        className="input-field"
        placeholder="Courier Address"
        value={courierAddress}
        onChange={(e) => setCourierAddress(e.target.value)}
      />
      <button className="button" onClick={createDelivery} disabled={isLoading}>
        <span>
          <svg
            height={24}
            width={24}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" fill="currentColor" />
          </svg>
          {isLoading ? "Creating..." : "Create Delivery"}
        </span>
      </button>

      <h3>Update Delivery Status</h3>
      <input
        className="input-field"
        placeholder="Delivery ID"
        value={deliveryId}
        onChange={(e) => setDeliveryId(e.target.value)}
      />
      <select className="select-field" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="0">Pending</option>
        <option value="1">In Transit</option>
        <option value="2">Delivered</option>
      </select>
      <button className="button" onClick={updateStatus} disabled={isLoading}>
        <span>
          <svg
            height={24}
            width={24}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" fill="currentColor" />
          </svg>
          {isLoading ? "Updating..." : "Update Status"}
        </span>
      </button>
    </div>
  );
};

export default DeliveryForm;