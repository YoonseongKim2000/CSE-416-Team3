import './AccountSettings.css'
import { Link, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import type { AuthOutletContext } from '../App';
import { generateHash } from '../utilities/hashutils';
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL
const selfUrl = import.meta.env.SELF_URL

function AccountSettingsPage() {

  const {contextState, contextSetState} = useOutletContext<AuthOutletContext>();

  const navigate = useNavigate();
  const [email, setEmail] = useState("Retrieving");
  const [subscriptionType, setSubscriptionType] = useState<"Free" | "Paid">("Free");
  const [tokenAmount, settokenAmount] = useState("Retrieving");
  const [apiKey, setApiKey] = useState("Retrieving");
  const [apiView, setApiView] = useState<"password" | "text">("password");
  const [buttonSwitch, setButtonSwitch] = useState(false);

  // Password modal
  const [showPassModal, setShowPassModal] = useState(false);
  const [fadeInPass, setFadeInPass] = useState(false);
  const [fadeOutPass, setFadeOutPass] = useState(false);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fadeInDelete, setFadeInDelete] = useState(false);
  const [fadeOutDelete, setFadeOutDelete] = useState(false);

  // Cancel modal
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [fadeInCancel, setFadeInCancel] = useState(false);
  const [fadeOutCancel, setFadeOutCancel] = useState(false);  

  // APIKey modal
  const [showAPIModal, setShowAPIModal] = useState(false);
  const [fadeInAPI, setFadeInAPI] = useState(false);
  const [fadeOutAPI, setFadeOutAPI] = useState(false);  

  const openPassModal = () => setShowPassModal(true);
  const openDeleteModal = () => setShowDeleteModal(true);
  const openCancelModal = () => setShowCancelModal(true);
  const openAPIModal = () => setShowAPIModal(true);
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

  useEffect(() => {
    if (showCancelModal) {
      const t = setTimeout(() => setFadeInCancel(true), 10);
      return () => clearTimeout(t);
    }
  }, [showCancelModal]);  

  useEffect(() => {
    if (showAPIModal) {
      const t = setTimeout(() => setFadeInAPI(true), 10);
      return () => clearTimeout(t);
    }
  }, [showAPIModal]);  

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
              } else {
                setSubscriptionType("Free");
                setButtonSwitch(false)
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

  const cancelPlan = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch (apiUrl + "user/cancelPlan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok){
        await getInfo();
      }
    } catch (error) {
      toast.error(""+error)
    }
  }

  const handleCancel = async (e:any) => {
    e.preventDefault();
    const check = e.target.elements.cancelInput.value
    if (check === "CANCEL"){
      cancelPlan();
      closeCancelModal();
    } else {
      toast.warning("Please type 'CANCEL', case sensitive")
    }
  }

  const handleRegen = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch (apiUrl + "user/regenKey", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok){
        await getInfo();
        closeAPIModal();
      }
    } catch (error) {
      toast.error(""+error)
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

  const closeCancelModal = () => {
    setFadeOutCancel(true);
    setFadeInCancel(false);
    setTimeout(() => {
      setShowCancelModal(false);
      setFadeOutCancel(false);
    }, 300);
  };

  const closeAPIModal = () => {
    setFadeOutAPI(true);
    setFadeInAPI(false);
    setTimeout(() => {
      setShowAPIModal(false);
      setFadeOutAPI(false);
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

    const updateData = {email: contextState.auth.email, password: hashedpw, newPassword: hashedNewpw};

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
      } else if (response.status == 401) {
        //access token invalid, logout
        toast.error("Error: Not authorized, logging out...")
        localStorage.clear();
        contextSetState(null);
        setTimeout(() => navigate('/'), 2500);
      } else if (response.ok) {
        toast.success("Password succesfully changed!");
        closePassModal();
      }
    } catch (err) {
      console.log(err);
      toast.error("" + (err));
    }
  }

  const handleDeleteAccount = async (e: any) => {
    e.preventDefault();

    const password = e.target.elements.passwordchk.value;

    if (!password) {
      toast.error("Please enter your password");
    }

    const hashedpw = generateHash(contextState.auth.email ? contextState.auth.email : "", password);
    const data = {email: contextState.auth.email, password: hashedpw};

    try {
      const response = await fetch (apiUrl + "user/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${contextState?.auth.accessToken}`,
          "Access-Control-Allow-Origin": selfUrl,
        },
        body: JSON.stringify(data)
      });

      if (response.status == 400) {
        toast.error("Required credentials missing");
      } else if (response.status == 500) {
        toast.error("Internal server error");
      } else if (response.status == 403) {
        toast.error("Incorrect password")
        e.target.reset();
      } else if (response.status == 401) {
        //access token invalid, logout
        toast.error("Error: Not authorized, logging out...")
        closeDeleteModal();
        localStorage.clear();
        contextSetState(null);
        setTimeout(() => navigate('/'), 2500);
      } else if (response.ok) {
        toast.success("Account successfully deleted");
        closeDeleteModal();
        localStorage.clear();
        contextSetState(null);
        setTimeout(() => navigate('/'), 2500);
      }
    } catch (err) {
      console.log(err);
      toast.error("" + (err));
    }
  }

  return (
    <div className="accountsettingspage container-fluid py-5 d-flex justify-content-center align-items-center p-reg">
      <div className="w-75">
        <h1 className="mb-4 fw-bold accountsettingtitle aw-regular">Account Settings</h1>

        <div className="card shadow-lg border-0 p-4">
          <span className='text-start accountnormaltext'>
            <b className='accountsettingboldtext'>Your Email: </b>{email}
          </span>
            <hr />
          <div className="text-start mb-3 accountnormaltext">
            <b className='accountsettingboldtext'>Tier:</b> {subscriptionType}
            <div className="text-start mb-1 accountnormaltext">
            <b className='accountsettingboldtext'>Tokens Remaining: </b> {tokenAmount}
            </div>

            {!buttonSwitch && (
              <Link to="/pricing">
              <button
                type="button"
                className="btn glow-btn AccountCustomBtn mt-3"
              >
                
                <span className="text">Upgrade Tier</span>
              </button>
              </Link>
            )}

            
            
            {buttonSwitch && (
              <button
              type="button"
              className="btn btn-outline-danger AccountCustomBtn mt-3"
              onClick={openCancelModal}
            >
              
              <span className="text">Cancel Plan</span>
            </button>
            )}
            
            
            <Link to="/purchasetoken">
              <button
                type="button"
                className="btn glow-btn AccountCustomBtn ms-3 mt-3"
              >
              
                <span className="text">Buy More Tokens</span>
              </button>
            </Link>
          </div>
            <hr />
          <div className="text-start d-flex align-items-center gap-3 mb-3 mt-3">
            <b className='accountsettingboldtext'>API KEY:</b>
            <input
              type={apiView}
              className="form-control accountkeydisplay"
              placeholder="Retrieving"
              readOnly
              value={apiKey}
            />
            <button type="button" className="btn btng acbtnsmall" onClick={revealHide}>

              <span className="text">Reveal/Hide</span>
            </button>
          </div>

          <div className='text-start d-flex flex-wrap gap-3 mb-3'>
            <button type="button" className="btn btn-outline-danger AccountCustomBtn" onClick={openAPIModal}>
              
              <span className="text">Regenerate Key</span>
            </button>


            <button type="button" className="btn btng AccountCustomBtn" onClick={() =>  navigator.clipboard.writeText(apiKey)}>

              <span className="text">Copy to Clipboard</span>
            </button>
          </div>

          <p className='text-start'>*Do not reveal your API key to anyone. Keep it secret, keep it safe.</p>
            <hr />
            {/* Change Password section */}
            <div className="text-start mb-3 mt-3">
              <b className="accountsettingboldtext">Password: </b>
              <button
                type="button"
                className="btn btnb AccountCustomBtn"
                onClick={openPassModal}
              >
                <span className="text">Change Password</span>
              </button>
            </div>  
            <hr />
            {/* Delete Account section */}
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-outline-danger AccountDeleteCustomBtn"
                onClick={openDeleteModal}
              >
                <span className="text">Delete Account</span>
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
                    <form onSubmit={handleDeleteAccount}>
                      <div className="modal-body text-start">
                        <p className="text-danger mb-3">
                          ⚠️ This action cannot be undone. Are you sure you want to delete your account?
                        </p>
                        <label className="form-label" htmlFor='passwordchk'>Confirm your password to proceed:</label>
                        <input type="password" className="form-control mb-3" placeholder="Enter your password" name='passwordchk'/>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary me-3" onClick={closeDeleteModal}>Cancel</button>
                        <button type="submit" className="btn btn-danger">Delete Account</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div
                className={`custom-backdrop ${fadeInDelete ? "fade-in" : ""} ${fadeOutDelete ? "fade-out" : ""}`}
                onClick={closeDeleteModal}
              ></div>
            </>
          )}

          {/* Cancel Modal */}
          {showCancelModal && (
            <>
              <div className={`custom-modal ${fadeInCancel ? "fade-in" : ""} ${fadeOutCancel ? "fade-out" : ""}`}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Cancel Tier</h5>
                      <button
                        type="button"
                        className="btn-close ms-auto"
                        onClick={closeCancelModal}
                      ></button>
                    </div>
                    <form onSubmit={handleCancel}>
                      <div className="modal-body text-start">
                        <label className="form-label">Type "CANCEL" to confirm your monthly cancellation:</label>
                        <input type="text" className="form-control mb-3" placeholder="CANCEL" name="cancelInput"/>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary me-3" onClick={closeCancelModal}>Abort</button>
                        <button type="submit" className="btn btn-danger">Confirm</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div
                className={`custom-backdrop ${fadeInCancel ? "fade-in" : ""} ${fadeOutCancel ? "fade-out" : ""}`}
                onClick={closeCancelModal}
              ></div>
            </>
          )}

          {/* API Modal */}
          {showAPIModal && (
            <>
              <div className={`custom-modal ${fadeInAPI ? "fade-in" : ""} ${fadeOutAPI ? "fade-out" : ""}`}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Regenerate API Key</h5>
                      <button
                        type="button"
                        className="btn-close ms-auto"
                        onClick={closeAPIModal}
                      ></button>
                    </div>

                    <div className="modal-body text-start">
                      <label className="form-label">Are you sure you want to regenerate your API key?</label>
                      <hr />
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary me-3" onClick={closeAPIModal}>Abort</button>
                      <button type="button" className="btn btn-danger" onClick={handleRegen}>Confirm</button>
                    </div>

                  </div>
                </div>
              </div>
              <div
                className={`custom-backdrop ${fadeInAPI ? "fade-in" : ""} ${fadeOutAPI ? "fade-out" : ""}`}
                onClick={closeAPIModal}
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
