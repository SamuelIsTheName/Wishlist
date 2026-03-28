// BookJournal.jsx
import { useState, useEffect, useRef } from "react";
import "./BookJournal.css";
import { DummyData } from "./dummyData.jsx";
import { GetAllItems } from "../../api/getAllItems";
import {createPortal} from "react-dom"

export default function BookJournal({ user }) {
  //const [items, setItems] = useState(DummyData);
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredId, setHoveredId] = useState(null);
  const [popupPos, setPopupPos] = useState({});
  const cardRefs = useRef({});
  const pageRef = useRef(null);
  const hideTimeout = useRef(null);

  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const data = await GetAllItems();
        setItems(data);

      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    console.log("dumplin "+ items);
    fetchWishlist();
  }, []);

  /* ---------------- PAGINATION ---------------- */
  const indexOfLast = currentPage * ITEMS_PER_PAGE;
  const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
  const currentItems = items.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  /* -------------------------------------------- */

  const handleMouseEnter = (id) => {
    clearTimeout(hideTimeout.current);

    const card = cardRefs.current[id];
    if (!card) return;

    const rect = card.getBoundingClientRect();

    const popupWidth = 220;
    const margin = 10;

    const spaceRight = window.innerWidth - rect.right;
    const placeLeft = spaceRight < popupWidth + margin;

    setPopupPos({
      top: rect.top,
      left: placeLeft
        ? rect.left - popupWidth - margin
        : rect.right + margin,
      arrowSide: placeLeft ? "right" : "left",
    });

    setHoveredId(id);
  };

  const handleMouseLeave = () => {
    hideTimeout.current = setTimeout(() => setHoveredId(null), 120);
  };

  const hoveredItem = items.find((i) => i.id === hoveredId);

  const handleUpdate = (e, id) => {
    e.stopPropagation();
    console.log("Update", id);
    // wire up your update logic here
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    console.log("Delete", id);
    // wire up your delete logic here
  };

  return (
    <div className="journal-page" ref={pageRef}>
      <div className="journal-grid">
        {currentItems.map((item) => (
          <div
            key={item.id}
            ref={(el) => (cardRefs.current[item.id] = el)}
            className="journal-card"
            onMouseEnter={() => handleMouseEnter(item.id)}
            onMouseLeave={handleMouseLeave}
            onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")}
          >
            {/* IMAGE */}
            <div className="journal-card__image">
              <img src="/images/noPhoto.jpg" alt={item.item_name} />
            </div>

            {/* STATIC TITLE BELOW CARD */}
            <div className="journal-card__footer">
              <span>{item.item_name}</span>
            </div>
          </div>
        ))}
      </div>

      {/* POPUP — position:fixed so it floats above everything */}
      {hoveredId &&
        hoveredItem &&
        createPortal(
          <div
            className={`card-popup card-popup--arrow-${popupPos.arrowSide}`}
            style={{
              position: "fixed",
              top: popupPos.top,
              left: popupPos.left,
              zIndex: 99999,
            }}
            onMouseEnter={() => clearTimeout(hideTimeout.current)}
            onMouseLeave={handleMouseLeave}
          >
          <div className="card-popup__header">
            <span className="card-popup__title">{hoveredItem.item_name}</span>
            <div className="card-popup__actions">
              <button
                className="card-popup__btn card-popup__btn--edit"
                onClick={(e) => handleUpdate(e, hoveredItem.id)}
                title="Edit"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button
                className="card-popup__btn card-popup__btn--delete"
                onClick={(e) => handleDelete(e, hoveredItem.id)}
                title="Delete"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
          {hoveredItem.note && (
            <p className="card-popup__description">{hoveredItem.note}</p>
          )}
        </div>,
        document.body
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination__btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            ← Prev
          </button>

          <div className="pagination__pages">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination__page ${currentPage === page ? "active" : ""}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            className="pagination__btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}