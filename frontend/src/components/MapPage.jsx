import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import mapImg from "../assets/roundbg.png";
import island1 from "../assets/island1.png";
import island2 from "../assets/island2.png";
import island3 from "../assets/island3.png";
import obj1 from "../assets/obj1.png";
import obj2 from "../assets/obj2.png";
import obj3 from "../assets/obj3.png";
import obj4 from "../assets/obj4.png";
import shovelImg from "../assets/shovel.png";
import "../styles/mapPage.css";

const API_BASE = "http://localhost:5000/kriyabe/api";

const MapPage = () => {
    const navigate = useNavigate();
    const [team, setTeam] = useState(null);
    const [allAlgoCards, setAllAlgoCards] = useState([]);
    const [selectedCards, setSelectedCards] = useState(() => {
        const saved = localStorage.getItem('kriya_selected_cards');
        return saved ? JSON.parse(saved) : [];
    });
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isActionPopupOpen, setIsActionPopupOpen] = useState(false);
    const [cardsChosen, setCardsChosen] = useState(() => {
        return localStorage.getItem('kriya_cards_chosen') === 'true';
    });

    // Treasure Hunt State
    const [isTreasureHunting, setIsTreasureHunting] = useState(false);
    const [foundObjects, setFoundObjects] = useState(() => {
        const saved = localStorage.getItem('kriya_found_objects');
        return saved ? JSON.parse(saved) : [];
    });
    const [currentTargetIndex, setCurrentTargetIndex] = useState(() => {
        const saved = localStorage.getItem('kriya_target_index');
        return saved ? parseInt(saved) : 0;
    });
    const [compassRotation, setCompassRotation] = useState(0);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
    const [flagInput, setFlagInput] = useState("");
    const [unlockedActionCards, setUnlockedActionCards] = useState(() => {
        const saved = localStorage.getItem('kriya_unlocked_actions');
        return saved ? JSON.parse(saved) : [101, 102, 103, 104];
    });

    const CHALLENGES = {
        d1: {
            title: "Mysterious Island Portal",
            url: "https://codequest-kriya-26-minigamectf.vercel.app/",
            flag: "FLAG{Pl4tf0rm1ng_P1r4t3_K1ng}",
            rewardId: 105,
            rewardName: "Ghost Ship"
        },
        d2: {
            title: "Ancient Navigator's Vault",
            url: "/puzzles/pirate_puzzle.html",
            flag: "FLAG{R1ng_Puzzl3_Mast3r_2026}",
            rewardId: 106,
            rewardName: "Kraken's Call"
        }
    };

    const [activeChallenge, setActiveChallenge] = useState(null);
    const [r2Questions, setR2Questions] = useState([]);
    const [isR2SolveOpen, setIsR2SolveOpen] = useState(false);
    const [currentR2Index, setCurrentR2Index] = useState(0);

    // Filter available cards from team's round1.selectedScrolls
    const availableCards = React.useMemo(() => {
        if (!team || !team.round1 || !team.round1.selectedScrolls || allAlgoCards.length === 0) return [];
        
        return team.round1.selectedScrolls.map(scroll => {
            const normalizedName = scroll.name.toLowerCase().replace(/\s+/g, '');
            const cardInfo = allAlgoCards.find(c => c.name.toLowerCase().replace(/\s+/g, '') === normalizedName);
            
            return {
                id: cardInfo?._id || scroll._id,
                name: scroll.name,
                color: "#c9a84c", // Standard gold for algorithm cards
                realId: cardInfo?._id
            };
        });
    }, [team, allAlgoCards]);

    const actionCards = [
        { id: 101, name: "Storm", color: "#4b6584", desc: "Create a coastal storm" },
        { id: 102, name: "Bounty", color: "#f7b731", desc: "Double gold for 1 turn" },
        { id: 103, name: "Kraken", color: "#eb3b5a", desc: "Summon a sea monster" },
        { id: 104, name: "Mist", color: "#a5b1c2", desc: "Hide ship movements" },
        { id: 105, name: "Ghost Ship", color: "#2c3e50", desc: "Become untargetable for 2 turns", isSecret: true },
        { id: 106, name: "Kraken's Call", color: "#130f40", desc: "Destroy an adjacent enemy ship", isSecret: true }
    ];

    // Island Graph Data - Easy to adjust size and position
    const islands = [
        { id: 1, name: "Isla Muerta", img: island1, top: "60%", left: "0%", size: "340px" },
        { id: 2, name: "Tortuga Island", img: island2, top: "60%", left: "69%", size: "390px" },
        { id: 3, name: "Port Royal", img: island3, top: "2%", left: "55%", size: "340px" }
    ];

    // Persist State to LocalStorage
    React.useEffect(() => {
        localStorage.setItem('kriya_found_objects', JSON.stringify(foundObjects));
        localStorage.setItem('kriya_target_index', currentTargetIndex.toString());
        localStorage.setItem('kriya_unlocked_actions', JSON.stringify(unlockedActionCards));
        localStorage.setItem('kriya_selected_cards', JSON.stringify(selectedCards));
        localStorage.setItem('kriya_cards_chosen', cardsChosen.toString());
    }, [foundObjects, currentTargetIndex, unlockedActionCards, selectedCards, cardsChosen]);

    // Clear old sync data if it exists
    React.useEffect(() => {
        localStorage.removeItem('kriya_island_config');
        fetchTeamData();
        fetchAlgos();
    }, []);

    async function fetchTeamData() {
        const storedTeam = JSON.parse(localStorage.getItem("team"));
        const token = localStorage.getItem("token");
        if (!storedTeam || !storedTeam.id) return;

        try {
            const res = await fetch(`${API_BASE}/teams/profile/${storedTeam.id}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setTeam(data);
        } catch (err) {
            console.error("Failed to fetch team data", err);
        }
    }

    async function fetchAlgos() {
        try {
            const res = await fetch(`${API_BASE}/algorithms`);
            const data = await res.json();
            if (res.ok) setAllAlgoCards(data);
        } catch (err) {
            console.error("Failed to fetch algorithms", err);
        }
    }

    const fetchR2Questions = async (pickedCards) => {
        try {
            const res = await fetch(`${API_BASE}/round2/questions`);
            const allQuestions = await res.json();
            if (!res.ok) return;

            const cardIds = pickedCards.map(c => c.realId).filter(Boolean);
            
            // Filter questions that allow at least one of our picked algorithm cards
            const filtered = allQuestions.filter(q => 
                q.allowedAlgorithms.some(algoId => cardIds.includes(algoId))
            );

            // Shuffling or picking top 3
            setR2Questions(filtered.slice(0, 3));
            if (filtered.length > 0) {
                setIsR2SolveOpen(true);
                setCurrentR2Index(0);
            } else {
                alert("No questions found for the selected algorithms yet!");
            }
        } catch (err) {
            console.error("Error fetching R2 questions", err);
        }
    };

  const decorations = [
    { id: "d1", img: obj1, top: "20%", left: "20%", size: "80px" },
    { id: "d2", img: obj2, top: "10%", left: "90%", size: "90px" },
    { id: "d3", img: obj3, top: "75%", left: "48%", size: "50px" },
    { id: "d4", img: obj4, top: "40%", left: "80%", size: "70px" },
  ];

  const handleMouseMove = (e) => {
    if (!isTreasureHunting || currentTargetIndex >= decorations.length) return;

    const mapImgElement = e.currentTarget.querySelector(".map-background");

    if (!mapImgElement) return;

    const imgRect = mapImgElement.getBoundingClientRect();

    // Calculate cursor position relative to the ACTUAL image bounds
    const mouseInImgX = e.clientX - imgRect.left;
    const mouseInImgY = e.clientY - imgRect.top;

    // Current shovel position for state
    setCursorPos({ x: e.clientX, y: e.clientY });

    const target = decorations[currentTargetIndex];

    // Convert target % coordinates to pixels based on the ACTUAL image size
    const targetX = (parseFloat(target.left) / 100) * imgRect.width;
    const targetY = (parseFloat(target.top) / 100) * imgRect.height;

    // Calculate angle from the mouse (within image) to target (within image)
    const dx = targetX - mouseInImgX;
    const dy = targetY - mouseInImgY;

    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    setCompassRotation(angle + 90); // +90 because the emoji needle points "up" (North)
  };

  const handleMapClick = (e) => {
    if (!isTreasureHunting || currentTargetIndex >= decorations.length) return;

    const mapImgElement = e.currentTarget.querySelector(".map-background");
    if (!mapImgElement) return;

    const imgRect = mapImgElement.getBoundingClientRect();

    // Cursor relative to the image
    const mouseInImgX = e.clientX - imgRect.left;
    const mouseInImgY = e.clientY - imgRect.top;

    const target = decorations[currentTargetIndex];
    const targetX = (parseFloat(target.left) / 100) * imgRect.width;
    const targetY = (parseFloat(target.top) / 100) * imgRect.height;

    // Distance check relative to the image scaling
    const distance = Math.sqrt(
      Math.pow(targetX - mouseInImgX, 2) + Math.pow(targetY - mouseInImgY, 2),
    );

    if (distance < 60) {
      const newFound = [...foundObjects, target.id];
      setFoundObjects(newFound);
      setCurrentTargetIndex(currentTargetIndex + 1);

      if (currentTargetIndex + 1 >= decorations.length) {
        setTimeout(() => {
          setIsTreasureHunting(false);
          alert("Complete! Map decorated.");
        }, 500);
      }
    }
  };

  const handleSelectCard = (card) => {
    if (
      selectedCards.length < 3 &&
      !selectedCards.find((c) => c.id === card.id)
    ) {
      setSelectedCards([...selectedCards, card]);
    }
  };

    const handleConfirmSelection = () => {
        if (selectedCards.length === 3) {
            setCardsChosen(true);
            setIsPopupOpen(false);
            fetchR2Questions(selectedCards);
        }
    };

    const handleRemoveCard = (cardId) => {
        setSelectedCards(selectedCards.filter(c => c.id !== cardId));
    };

    const handleObjClick = (objId) => {
        if (CHALLENGES[objId] && foundObjects.includes(objId)) {
            setActiveChallenge(CHALLENGES[objId]);
            setIsFlagModalOpen(true);
        }
    };

    const handleFlagSubmit = (e) => {
        e.preventDefault();
        if (!activeChallenge) return;

        if (flagInput.trim() === activeChallenge.flag) {
            if (!unlockedActionCards.includes(activeChallenge.rewardId)) {
                setUnlockedActionCards([...unlockedActionCards, activeChallenge.rewardId]);
                alert(`Success! The ${activeChallenge.rewardName} action card has been unlocked.`);
            } else {
                alert("You have already claimed this reward!");
            }
            setIsFlagModalOpen(false);
            setFlagInput("");
        } else {
            alert("Incorrect flag! Try again.");
        }
    };

  return (
    <div
      className={`map-page-container ${isTreasureHunting ? "treasure-hunting-active" : ""}`}
    >
      <div
        className="map-viewport"
        onMouseMove={handleMouseMove}
        onClick={handleMapClick}
        style={{ cursor: isTreasureHunting ? "none" : "default" }}
      >
        <img src={mapImg} alt="World Map" className="map-background" />

        <div className="islands-layer">
          {islands.map((island) => (
            <div
              key={island.id}
              className={`island-node island-${island.id}`}
              style={{ top: island.top, left: island.left, cursor: "pointer" }}
              onClick={() => {
                if (!isTreasureHunting) {
                  navigate("/codequest/arena");
                }
              }}
            >
              <img
                src={island.img}
                alt={island.name}
                className="island-image"
                style={{ width: island.size || "150px" }}
              />
              <div className="island-info">
                <span className="island-name">{island.name}</span>
              </div>
            </div>
          ))}

                    {/* Decorations Layer */}
                    {decorations.map(obj => (
                        <div
                            key={obj.id}
                            className={`map-decoration ${foundObjects.includes(obj.id) ? 'found' : 'hidden'} ${CHALLENGES[obj.id] && foundObjects.includes(obj.id) ? 'interactive' : ''}`}
                            style={{
                                top: obj.top,
                                left: obj.left,
                                width: obj.size
                            }}
                            onClick={(e) => {
                                if (foundObjects.includes(obj.id)) {
                                    e.stopPropagation();
                                    handleObjClick(obj.id);
                                }
                            }}
                        >
                            <img src={obj.img} alt="Map Decoration" className="decoration-image" />
                            {CHALLENGES[obj.id] && foundObjects.includes(obj.id) && !unlockedActionCards.includes(CHALLENGES[obj.id].rewardId) && (
                                <div className="interactive-hint">!</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

      <nav className="card-navbar">
        <div className="navbar-left">
          <div className="selected-cards-container">
            {[0, 1, 2].map((index) => (
              <div key={index} className="card-slot portrait-card">
                {selectedCards[index] ? (
                  <div
                    className="card-content"
                    style={{ backgroundColor: selectedCards[index].color }}
                  >
                    <span>{selectedCards[index].name}</span>
                  </div>
                ) : (
                  <div className="card-placeholder">?</div>
                )}
              </div>
            ))}
          </div>

          {!cardsChosen && (
            <div
              className="choose-cards-option"
              onClick={() => setIsPopupOpen(true)}
            >
              <div className="plus-icon">+</div>
              <span>Choose Cards</span>
            </div>
          )}
        </div>

        <div className="navbar-right">
          <div className="nav-actions-group">
            {foundObjects.length < decorations.length && (
              <div
                className={`treasure-hunt-btn ${isTreasureHunting ? "active" : ""}`}
                onClick={() => setIsTreasureHunting(!isTreasureHunting)}
              >
                <div className="treasure-icon">💎</div>
                <span>{isTreasureHunting ? "Cancel" : "Find Treasure"}</span>
              </div>
            )}
            <div
              className="action-cards-btn"
              onClick={() => setIsActionPopupOpen(true)}
            >
              <div className="action-icon">⚡</div>
              <span>Action Cards</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="map-overlay">
        {/* Future overlay content like pins or labels can go here */}
      </div>

      {/* Treasure Hunt UI Layer - Absolute Top Z-Index */}
      {isTreasureHunting && (
        <>
          {/* Shovel Cursor */}
          <div
            className="shovel-cursor"
            style={{
              left: cursorPos.x,
              top: cursorPos.y,
            }}
          >
            <img src={shovelImg} alt="Shovel Cursor" className="shovel-image" />
          </div>

          {/* Fixed Radar Compass */}
          {currentTargetIndex < decorations.length && (
            <div className="fixed-treasure-compass">
              <div
                className="compass-needle"
                style={{ transform: `rotate(${compassRotation}deg)` }}
              >
                🧭
              </div>
              <div className="compass-label">Radar</div>
            </div>
          )}
        </>
      )}

      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Select 3 Cards</h2>
            <div className="available-cards-grid">
              {availableCards.map((card) => {
                const isSelected = selectedCards.find((c) => c.id === card.id);
                return (
                  <div
                    key={card.id}
                    className={`available-card portrait-card ${isSelected ? "selected" : ""}`}
                    onClick={() =>
                      isSelected
                        ? handleRemoveCard(card.id)
                        : handleSelectCard(card)
                    }
                  >
                    <div
                      className="card-content"
                      style={{ backgroundColor: card.color }}
                    >
                      <span>{card.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="popup-actions">
              <button
                className="confirm-btn"
                disabled={selectedCards.length !== 3}
                onClick={handleConfirmSelection}
              >
                Confirm Selection ({selectedCards.length}/3)
              </button>
              <button
                className="cancel-btn"
                onClick={() => setIsPopupOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

            {isActionPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup-content action-popup">
                        <h2>Action Cards</h2>
                        <div className="action-cards-grid">
                            {actionCards.filter(card => unlockedActionCards.includes(card.id)).map((card) => (
                                <div key={card.id} className="action-card-item">
                                    <div className="action-card-visual" style={{ backgroundColor: card.color }}>
                                        <span className="action-card-name">{card.name}</span>
                                    </div>
                                    <p className="action-card-desc">{card.desc}</p>
                                </div>
                            ))}
                            {actionCards.filter(card => !unlockedActionCards.includes(card.id)).map((card) => (
                                <div key={card.id} className="action-card-item locked">
                                    <div className="action-card-visual locked">
                                        <span className="action-card-name">???</span>
                                        <div className="lock-icon">🔒</div>
                                    </div>
                                    <p className="action-card-desc">Complete the objective challenge to unlock</p>
                                </div>
                            ))}
                        </div>
                        <div className="popup-actions">
                            <button className="confirm-btn" onClick={() => setIsActionPopupOpen(false)}>
                                Back to Map
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isFlagModalOpen && (
                <div className="popup-overlay" onClick={() => setIsFlagModalOpen(false)}>
                    <div className="popup-content flag-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{activeChallenge?.title || "Mysterious Portal Found!"}</h2>
                            <p>You found an ancient artifact. It seems to lead to a hidden challenge.</p>
                        </div>
                        
                        <div className="modal-body">
                            <div className="challenge-link-box">
                                <p>Enter the portal to find the hidden flag:</p>
                                <a 
                                    href={activeChallenge?.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="mini-game-link"
                                >
                                    Enter Portal ➔
                                </a>
                            </div>

                            <form className="flag-submit-form" onSubmit={handleFlagSubmit}>
                                <label>Enter the Flag revealed in the mini-game:</label>
                                <input 
                                    type="text" 
                                    placeholder="FLAG{...}" 
                                    value={flagInput}
                                    onChange={(e) => setFlagInput(e.target.value)}
                                    required
                                />
                                <button type="submit" className="confirm-btn">Claim Reward</button>
                            </form>
                        </div>

                        <div className="popup-actions">
                            <button className="cancel-btn" onClick={() => setIsFlagModalOpen(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {isR2SolveOpen && r2Questions[currentR2Index] && (
                <div className="popup-overlay">
                    <div className="popup-content r2-solve-modal" style={{ maxWidth: '800px', width: '90%' }}>
                        <div className="modal-header">
                            <span className="quest-count" style={{ display: 'block', color: '#c9a84c', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '10px' }}>
                                QUESTION {currentR2Index + 1} OF {r2Questions.length}
                            </span>
                            <h2 style={{ fontSize: '2rem', margin: '0' }}>{r2Questions[currentR2Index].title}</h2>
                        </div>
                        <div className="modal-body" style={{ marginTop: '20px' }}>
                            <div className="problem-desc" style={{ 
                                whiteSpace: 'pre-line', 
                                textAlign: 'left', 
                                background: 'rgba(0,0,0,0.4)', 
                                padding: '25px', 
                                borderRadius: '15px',
                                border: '1px solid rgba(201, 168, 76, 0.2)',
                                lineHeight: '1.6',
                                fontSize: '1.1rem',
                                maxHeight: '400px',
                                overflowY: 'auto',
                                color: '#e6edf3'
                            }}>
                                {r2Questions[currentR2Index].description}
                            </div>
                            
                            <div className="problem-meta" style={{ marginTop: '20px', display: 'flex', gap: '30px', fontSize: '1rem', color: '#c9a84c' }}>
                                <span>⏱️ Time Limit: <strong>{r2Questions[currentR2Index].timeLimitSec}s</strong></span>
                                <span>🧪 Test Cases: <strong>{r2Questions[currentR2Index].testCases?.length || 0}</strong></span>
                            </div>
                        </div>
                        <div className="popup-actions" style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                            {currentR2Index < r2Questions.length - 1 ? (
                                <button className="confirm-btn" onClick={() => setCurrentR2Index(currentR2Index + 1)}>Next Problem ➔</button>
                            ) : (
                                <button className="confirm-btn" onClick={() => {
                                    setIsR2SolveOpen(false);
                                    setCardsChosen(false);
                                    setSelectedCards([]);
                                }}>Complete Set 🏅</button>
                            )}
                            <button className="cancel-btn" onClick={() => setIsR2SolveOpen(false)}>Back to Map</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapPage;
