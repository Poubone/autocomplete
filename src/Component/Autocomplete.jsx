import "./AutoComplete.css";
import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AutoComplete({ fetchData, options = [], onItemSelect, allowMultiple = false, pathTemplate }) {
    const [inputValue, setInputValue] = useState("");
    const [suggestionList, setSuggestionList] = useState([]);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState(allowMultiple ? [] : null);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const LazyComponent = lazy(() => import(pathTemplate));

    const containerRef = useRef(null);

    const handleInputChange = async (event) => {
        const query = event.target.value.trimStart();
        setInputValue(query);

        if (query.length > 0) {
            if (fetchData) {
                const results = await fetchData(query);
                setSuggestionList(results);
            } else if (options.length > 0) {
                const filteredOptions = options.filter((option) =>
                    option.label.toLowerCase().includes(query.toLowerCase())
                );
                setSuggestionList(filteredOptions);
            }
            setDropdownOpen(true);
        } else {
            setSuggestionList([]);
            setDropdownOpen(false);
        }
    };

    const handleSelection = (item) => {
        if (allowMultiple) {
            if (!selectedItems.some((selected) => selected.label === item.label)) {
                const updatedSelection = [...selectedItems, item];
                setSelectedItems(updatedSelection);
                onItemSelect(updatedSelection);
            }
            setInputValue("");
        } else {
            setInputValue(item.label);
            setSelectedItems(item);
            onItemSelect(item);
            setDropdownOpen(false);
        }
    };

    const removeSelectedItem = (itemToRemove) => {
        if (allowMultiple) {
            const updatedSelection = selectedItems.filter(
                (selected) => selected.label !== itemToRemove.label
            );
            setSelectedItems(updatedSelection);
            onItemSelect(updatedSelection);
        }
    };

    const handleKeyNavigation = (event) => {
        if (event.key === "ArrowDown") {
            setHighlightedIndex((prev) => Math.min(prev + 1, suggestionList.length - 1));
        } else if (event.key === "ArrowUp") {
            setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        } else if (event.key === "Enter" && highlightedIndex >= 0) {
            handleSelection(suggestionList[highlightedIndex]);
        } else if (event.key === "Escape") {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    useEffect(() => {
        if (highlightedIndex >= 0 && highlightedIndex < suggestionList.length) {
            setInputValue(suggestionList[highlightedIndex].label);
        }
    }, [highlightedIndex, suggestionList]);

    return (
        <div className="autocomplete-container" ref={containerRef}>
            {allowMultiple && (
                <div className="selected-items">
                    {selectedItems.map((item, index) => (
                        <div key={index} className="selected-item">
                            <span>{item.label}</span>
                            <button
                                className="remove-button"
                                onClick={() => removeSelectedItem(item)}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyNavigation}
                placeholder="Rechercher..."
                className="autocomplete-input"
            />
            {isDropdownOpen && suggestionList.length > 0 && (
                <ul className="suggestion-list">
                    {suggestionList.map((suggestion, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelection(suggestion)}
                            className={`suggestion-item ${index === highlightedIndex ? "highlighted" : ""
                                } ${allowMultiple &&
                                    selectedItems.some((selected) => selected.label === suggestion.label)
                                    ? "selected-in-list"
                                    : ""
                                }`}
                        >
                            {pathTemplate ? (
                                <Suspense fallback={<div>Loading...</div>}>
                                    <LazyComponent suggestion={suggestion} />
                                </Suspense>
                            ) : (
                                <div>
                                    <FontAwesomeIcon icon={suggestion.icon} className="icon" />
                                    {suggestion.label}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
