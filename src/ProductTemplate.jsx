import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ProductTemplate({ suggestion }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <FontAwesomeIcon icon={suggestion.icon} className="icon" />
            <span style={{ marginLeft: '8px' }}>{suggestion.label}</span>
        </div>
    );
}
