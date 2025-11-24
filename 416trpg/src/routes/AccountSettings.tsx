import './AccountSettings.css'
import { Link, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
<<<<<<< HEAD
import { ToastContainer, toast } from 'react-toastify';
import type { AuthOutletContext } from '../App';
import { generateHash } from '../utilities/hashutils';
=======
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
>>>>>>> 7e7374d699ba50c3eb13035f24901fb4780e17b8

const apiUrl = import.meta.env.VITE_API_URL

function AccountSettingsPage() {
<<<<<<< HEAD

  const {contextState, contextSetState} = useOutletContext<AuthOutletContext>();

=======
  const navigate = useNavigate();
>>>>>>> 7e7374d699ba50c3eb13035f24901fb4780e17b8
  const [email, setEmail] = useState("Retrieving");
  const [subscriptionType, setSubscriptionType] = useState<"Free" | "Paid">("Free");
  const [tokenAmount, settokenAmount] = useState("Retrieving");
  const [apiKey, setApiKey] = useState("Retrieving");
  const [apiView, setApiView] = useState<"password" | "text">("password");

  // Password modal
  const [showPassModal, setShowPassModal] = useState(false);
  const [fadeInPass, setFadeInPass] = useState(false);
  const [fadeOutPass, setFadeOutPass] = useState(false);
  const [buttonSwitch, setButtonSwitch] = useState(false);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fadeInDelete, setFadeInDelete] = useState(false);
  const [fadeOutDelete, setFadeOutDelete] = useState(false);

  const openPassModal = () => setShowPassModal(true);
  const openDeleteModal = () => setShowDeleteModal(true);
  const revealHide = () => {
    if (apiView == "password") {
        setApiView("text");
    } else {
        setApiView("password");
    }
    
  }

  useEffect(() => {
    getInfo()
  })

  // Fade-in animation triggers (per modal)
  useEffect(() => {
    if (showPassModal) {
      const t = setTimeout(() => setFadeInPass(true), 10);
      return () => clearTimeout(t);
    }
  }, [showPassModal]);

  useEffect(() => {
    if (showDeleteModal) {
      const t = setTimeout(() => setFadeInDelete(true), 10);
      return () => clearTimeout(t);
    }
  }, [showDeleteModal]);

  const getInfo = async () => {
    const storedEmail = localStorage.getItem("email");

    if (storedEmail === null) {
      navigate("/login");
      return;
    }
    const token = localStorage.getItem("accessToken");
    setEmail(storedEmail);

    try {
      const response = await fetch (apiUrl + "user/info", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok){
              const data = await response.json();
              if (data.tier){
                setSubscriptionType("Paid");
                setButtonSwitch(true)
              };
              settokenAmount(data.tokenRemaining);
              setApiKey(data.apiKey);
            } else {
                toast.error("Something went wrong");
                return;
            };
    } catch (error) {
      toast.error("" + error)
    }

    
  }

  // Close animations
  const closePassModal = () => {
    setFadeOutPass(true);
    setFadeInPass(false);
    setTimeout(() => {
      setShowPassModal(false);
      setFadeOutPass(false);
    }, 300);
  };

  const closeDeleteModal = () => {
    setFadeOutDelete(true);
    setFadeInDelete(false);
    setTimeout(() => {
      setShowDeleteModal(false);
      setFadeOutDelete(false);
    }, 300);
  };

  const handleChangePassword = async (e: any) => {
    e.preventDefault();

    const currpw = e.target.elements.currentpw.value;
    const newpw = e.target.elements.newpw.value;
    const confirmNewpw = e.target.elements.confirmNewpw.value;

    if (!currpw || !newpw || !confirmNewpw) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newpw != confirmNewpw) {
      toast.error("New password and confirm new password do not match");
      return;
    }

    const hashedpw = generateHash(contextState.auth.email ? contextState.auth.email : "", currpw);
    const hashedNewpw = generateHash(contextState.auth.email ? contextState.auth.email : "", newpw);

    const updateData = {email: contextState.auth.email, password: hashedpw, newPassword: newpw};

    try {
      const response = await fetch(apiUrl + "user/password", {
        method: "PUT",
        credentials: "include",
        headers: {
          'Authorization': `Bearer ${contextState?.auth.accessToken}`,
          'Content-Type': 'application/json',
          "Access-Control-Allow-Origin": selfUrl,
        },
        body: JSON.stringify(updateData)
      });

      if (response.status == 400) {
        toast.error("Incorrect credentials or wrong current password");
      } else if (response.status == 500) {
        toast.error("Internal server error");
      } else {
        toast.success("Password succesfully changed!");
        closePassModal();
      }
    } catch (err) {
      console.log(err);
      toast.error("" + (err));
    }
  }

  return (
    <div className="accountsettingspage container-fluid py-5 d-flex justify-content-center align-items-center">
      <div className="w-75">
        <h1 className="mb-4 fw-bold accountsettingtitle">Account Settings</h1>

        <div className="card shadow-lg border-0 p-4">
          <span className='text-start accountnormaltext'>
            <b className='accountsettingboldtext'>Your Email: </b>{email}
          </span>
            <hr />
          <div className="text-start mb-3 accountnormaltext">
            <b className='accountsettingboldtext'>Tier:</b> {subscriptionType}
            <div className="text-start mb-3 accountnormaltext">
            <b className='accountsettingboldtext'>Tokens Remaining: </b> {tokenAmount}
            </div>

            {!buttonSwitch && (
              <Link to="/pricing">
              <button
                type="button"
                className="button-82-pushable AccountCustomBtn ms-3 mt-3"
              >
                <span className="button-82-shadow"></span>
                <span className="button-82-edge"></span>
                <span className="button-82-front text">Upgrade Tier</span>
              </button>
              </Link>
            )}

            
            
            {buttonSwitch && (
              <button
              type="button"
              className="button-82-pushable AccountCustomBtn ms-3 mt-3"
            >
              <span className="button-82-shadow"></span>
              <span className="button-82-edge"></span>
              <span className="button-82-front text">Cancel Plan</span>
            </button>
            )}
            
            
            <Link to="/purchasetoken">
              <button
                type="button"
                className="button-82-pushable AccountCustomBtn ms-3 mt-3"
              >
                <span className="button-82-shadow"></span>
                <span className="button-82-edge"></span>
                <span className="button-82-front text">Buy More Tokens</span>
              </button>
            </Link>
          </div>
            <hr />
          <div className="text-start d-flex align-items-center gap-3 mb-3">
            <b className='accountsettingboldtext'>API KEY:</b>
            <input
              type={apiView}
              className="form-control accountkeydisplay"
              placeholder="Retrieving"
              readOnly
              value={apiKey}
            />
          </div>

          <div className='text-start d-flex flex-wrap gap-3 mb-3'>
            <button type="button" className="button-82-pushable AccountCustomBtn">
              <span className="button-82-shadow"></span>
              <span className="button-82-edge"></span>
              <span className="button-82-front text">Generate</span>
            </button>

            <button type="button" className="button-82-pushable AccountCustomBtn" onClick={revealHide}>
              <span className="button-82-shadow"></span>
              <span className="button-82-edge"></span>
              <span className="button-82-front text">Reveal/Hide</span>
            </button>

            <button type="button" className="button-82-pushable AccountCustomBtn" onClick={() =>  navigator.clipboard.writeText(apiKey)}>
              <span className="button-82-shadow"></span>
              <span className="button-82-edge"></span>
              <span className="button-82-front text">Copy to Clipboard</span>
            </button>
          </div>

          <p className='text-start'>*Do not reveal your API key to anyone. Keep it secret, keep it safe.</p>
            <hr />
            {/* Change Password section */}
            <div className="text-start mb-3">
              <b className="accountsettingboldtext">Password: </b>
              <button
                type="button"
                className="button-82-pushable AccountCustomBtn"
                onClick={openPassModal}
              >
                <span className="button-82-shadow"></span>
                <span className="button-82-edge"></span>
                <span className="button-82-front text">Change Password</span>
              </button>
            </div>  
            <hr />
            {/* Delete Account section */}
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="button-82-pushable AccountDeleteCustomBtn"
                onClick={openDeleteModal}
              >
                <span className="button-82-shadow"></span>
                <span className="button-82-edge"></span>
                <span className="button-82-front text">Delete Account</span>
              </button>
            </div>


          {/* --- PASSWORD MODAL --- */}
          {showPassModal && (
            <>
              <div className={`custom-modal ${fadeInPass ? "fade-in" : ""} ${fadeOutPass ? "fade-out" : ""}`}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Change Password</h5>
                      <button
                        type="button"
                        className="btn-close ms-auto"
                        onClick={closePassModal}
                      ></button>
                    </div>
                    <form onSubmit={handleChangePassword}>
                      <div className="modal-body text-start">
                        <label htmlFor="currentpw">Current Password</label>
                        <input type="password" className='form-control mb-3' name='currentpw' placeholder='Enter current password'/>
                        <label className="form-label" htmlFor='newpw'>New Password</label>
                        <input type="password" className="form-control mb-3" name='newpw' placeholder="Enter new password" />
                        <label className="form-label" htmlFor='confirmNewpw'>Confirm New Password</label>
                        <input type="password" className="form-control mb-3"name='confirmNewpw' placeholder="Confirm new password" />
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary me-3" onClick={closePassModal}>Close</button>
                        <button type="submit" className="btn btn-primary">Confirm Change</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div
                className={`custom-backdrop ${fadeInPass ? "fade-in" : ""} ${fadeOutPass ? "fade-out" : ""}`}
                onClick={closePassModal}
              ></div>
            </>
          )}
            <ToastContainer position='top-center' autoClose={2500} theme='colored'/>

          {/* --- DELETE ACCOUNT MODAL --- */}
          {showDeleteModal && (
            <>
              <div className={`custom-modal ${fadeInDelete ? "fade-in" : ""} ${fadeOutDelete ? "fade-out" : ""}`}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title text-danger">Delete Account</h5>
                      <button
                        type="button"
                        className="btn-close ms-auto"
                        onClick={closeDeleteModal}
                      ></button>
                    </div>
                    <div className="modal-body text-start">
                      <p className="text-danger mb-3">
                        ⚠️ This action cannot be undone. Are you sure you want to delete your account?
                      </p>
                      <label className="form-label">Confirm your password to proceed:</label>
                      <input type="password" className="form-control mb-3" placeholder="Enter your password" />
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary me-3" onClick={closeDeleteModal}>Cancel</button>
                      <button type="button" className="btn btn-danger">Delete Account</button>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`custom-backdrop ${fadeInDelete ? "fade-in" : ""} ${fadeOutDelete ? "fade-out" : ""}`}
                onClick={closeDeleteModal}
              ></div>
            </>
          )}
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={2500} theme="colored" />
    </div>
  );
}

export default AccountSettingsPage;
