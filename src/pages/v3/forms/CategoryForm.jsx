import React, { useState } from 'react';
import Modal from '../../../components/modal/Modal';
import { generateUniqueID } from '../../../library/utils';
import CustomIconPicker from '../../../library/customeIconPicker/customIconPicker';
import { addCategory } from '../../../library/firebase/v3/controller';
import { Icon, Icons } from '../../../assets/Icons';
import '../../../css/v3/form.css';
import '../../../css/v3/categoryForm.css';


// Preset color swatches
const COLOR_SWATCHES = [
    '#f87171', '#fb923c', '#fbbf24', '#a3e635',
    '#34d399', '#22d3ee', '#60a5fa', '#a78bfa',
    '#f472b6', '#e879f9', '#94a3b8', '#ffffff',
];

const CategoryForm = () => {
    const [loading, setLoading] = useState(false);
    const randomColor = COLOR_SWATCHES[Math.floor(Math.random() * COLOR_SWATCHES.length)];
    // Form fields
    const [type, setType] = useState('expense');
    const [name, setName] = useState('');
    const [color, setColor] = useState(randomColor);
    const [selectedIcon, setSelectedIcon] = useState('');

    // Icon picker modal
    const [isIconModalOpen, setIsIconModalOpen] = useState(false);

    const handleSelectIcon = (iconName) => {
        setSelectedIcon(iconName);
        setIsIconModalOpen(false);
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            alert('Please enter a category name.');
            return;
        }
        if (!selectedIcon) {
            alert('Please select an icon.');
            return;
        }

        setLoading(true);

        const data = {
            type,
            name: name.trim(),
            color,
            icon: selectedIcon,
        };
        console.log(data);

        const result = await addCategory(data);
        setLoading(false);

        if (result.status === 'success') {
            setType('expense');
            setName('');
            setColor(randomColor);
            setSelectedIcon('');
        } else {
            alert('Failed to add category. Please try again.');
        }
    };

    return (
        <div className="shared-form-container-v3">

            {/* ── Single Row Card ── */}
            <div className="shared-form-row-v3 single">
                <div className="shared-form-input-group-v3 single">

                    {/* TYPE toggle */}
                    <div className="shared-form-label-v3 single">Type</div>
                    <div className="category-form-type-toggle-v3">
                        {[
                            'expense',
                            'income',
                            // 'saving'
                        ].map((t) => (
                            <button
                                key={t}
                                className={`category-form-type-btn-v3 ${type === t ? 'active' : ''} type-${t}-v3`}
                                onClick={() => setType(t)}
                                type="button"
                            >
                                <Icon
                                    name={
                                        t === 'expense' ? 'LuArrowBigDownDash'
                                            : t === 'income' ? 'LuArrowBigUpDash'
                                                : 'LuCoins'
                                    }
                                    size={15}
                                />
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* NAME */}
                    <div className="shared-form-label-v3 single">Name</div>
                    <input
                        type="text"
                        className="shared-form-field-v3 single"
                        placeholder="Category Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    {/* COLOR */}
                    <div className="shared-form-label-v3 single">Color</div>
                    <div className="category-form-color-wrap-v3">
                        <label className="category-form-color-preview-v3" style={{ background: color }}>
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="category-form-color-input-v3"
                                title="Pick a custom color"
                            />
                        </label>

                        <div className="category-form-swatches-v3">
                            {COLOR_SWATCHES.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    className={`category-form-swatch-v3 ${color === c ? 'active' : ''}`}
                                    style={{ background: c }}
                                    onClick={() => setColor(c)}
                                    title={c}
                                />
                            ))}
                        </div>
                    </div>

                    {/* ICON */}
                    <div className="shared-form-label-v3 single">Icon</div>
                    <button
                        type="button"
                        className="category-form-icon-trigger-v3"
                        onClick={() => setIsIconModalOpen(true)}
                    >
                        {selectedIcon ? (
                            <>
                                <span
                                    className="category-form-icon-preview-v3"
                                    style={{ color, background: `${color}20` }}
                                >
                                    <Icon name={selectedIcon} size={22} />
                                </span>
                                <span className="category-form-icon-trigger-name-v3">{selectedIcon}</span>
                                <span className="category-form-icon-trigger-change-v3">Change</span>
                            </>
                        ) : (
                            <>
                                <span className="category-form-icon-placeholder-v3">
                                    <Icon name="LuSparkles" size={20} />
                                </span>
                                <span className="category-form-icon-trigger-hint-v3">Tap to choose an icon</span>
                            </>
                        )}
                    </button>

                </div>
            </div>

            {/* ── Footer Submit ── */}
            <div className="shared-form-footer-v3">
                <button
                    className={`shared-form-submit-all-v3 single ${loading ? 'loading' : ''}`}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Add Category'}
                </button>
            </div>

            {/* ── Icon Picker Modal ── */}
            <Modal
                title="Choose an Icon"
                isModalOpen={isIconModalOpen}
                onClose={() => setIsIconModalOpen(false)}
                fullscreen={false}
                maxWidth="520px"
                closeOnOverlay={true}
                zIndex={6000}
            >
                <CustomIconPicker
                    selectedIcon={selectedIcon}
                    color={color}
                    onSelect={handleSelectIcon}
                />
            </Modal>

        </div>
    );
};

export default CategoryForm;
