import React, { useState } from 'react';
import { Icon, Icons } from '../../assets/Icons';
import './customIconPicker.css';

const ALL_ICON_NAMES = Object.keys(Icons);

/**
 * CustomIconPicker
 *
 * Props:
 *  - selectedIcon  {string}   Currently selected icon name (e.g. "FaMugHot")
 *  - color         {string}   Accent color used to highlight the active icon
 *  - onSelect      {function} Callback fired with the chosen icon name
 */
const CustomIconPicker = ({ selectedIcon = '', color = '#60a5fa', onSelect }) => {
    const [iconSearch, setIconSearch] = useState('');

    const filteredIcons = ALL_ICON_NAMES.filter((n) =>
        n.toLowerCase().includes(iconSearch.toLowerCase())
    );

    const handleSelect = (iconName) => {
        if (onSelect) onSelect(iconName);
        setIconSearch('');
    };

    return (
        <div className="icon-picker-wrap">
            {/* Search */}
            <div className="icon-picker-search-wrap">
                <Icon name="LuSparkles" size={15} className="icon-picker-search-icon" />
                <input
                    type="text"
                    className="icon-picker-search"
                    placeholder="Search icons…"
                    value={iconSearch}
                    onChange={(e) => setIconSearch(e.target.value)}
                    autoFocus
                />
            </div>

            {/* Grid */}
            <div className="icon-picker-grid">
                {filteredIcons.length > 0 ? (
                    filteredIcons.map((iconName) => (
                        <button
                            key={iconName}
                            type="button"
                            className={`icon-picker-item ${selectedIcon === iconName ? 'active' : ''}`}
                            onClick={() => handleSelect(iconName)}
                            title={iconName}
                            style={
                                selectedIcon === iconName
                                    ? { color, borderColor: color, background: `${color}18` }
                                    : {}
                            }
                        >
                            <Icon name={iconName} size={22} />
                            <span className="icon-picker-item-label">
                                {iconName.replace(/^(Lu|Fa|Lia)/, '')}
                            </span>
                        </button>
                    ))
                ) : (
                    <div className="icon-picker-empty">No icons found</div>
                )}
            </div>
        </div>
    );
};

export default CustomIconPicker;
