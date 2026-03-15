import React, { useState, useEffect } from 'react';
import { LuPlus, LuMinus, LuBadgePercent, LuCheck, LuWallet, LuCalendar } from "react-icons/lu";
import { useParams } from 'react-router-dom';
import { expensesTracker, getExpenses, getAllDataActiveRealTimeController } from '../../../firebase/controller';
import { getTodayDate } from '../../../firebase/utils';
import '../../../css/v2/v2-form.css';

const ExpensesForm = ({ onFinish }) => {
    const { paramMonth } = useParams();
    const [categories, setCategories] = useState([]);
    const [isFetchingCategories, setIsFetchingCategories] = useState(true);
    const [loading, setLoading] = useState(false);

    // Header state
    const [headerDate, setHeaderDate] = useState(getTodayDate());
    const [selectedWallet, setSelectedWallet] = useState('');
    const [wallets, setWallets] = useState([]);
    const [isWalletsFetching, setIsWalletsFetching] = useState(true);

    // Manage multiple rows
    const [rows, setRows] = useState([
        { id: Date.now(), category: '', description: '', price: '', discount: '', showDiscount: false }
    ]);

    useEffect(() => {
        const fetchInitialData = async () => {
            await getExpenses(paramMonth, setCategories, setIsFetchingCategories, true);
            await getAllDataActiveRealTimeController('wallets', setWallets, setIsWalletsFetching);
        };
        fetchInitialData();
    }, [paramMonth]);

    const handleInputChange = (id, field, value) => {
        setRows(rows.map(row =>
            row.id === id ? { ...row, [field]: value } : row
        ));
    };

    const addRow = () => {
        setRows([...rows, { id: Date.now(), category: '', description: '', price: '', discount: '', showDiscount: false }]);
    };

    const toggleDiscount = (id) => {
        setRows(rows.map(row =>
            row.id === id ? { ...row, showDiscount: !row.showDiscount } : row
        ));
    };

    const removeRow = (id) => {
        if (rows.length > 1) {
            setRows(rows.filter(row => row.id !== id));
        } else {
            setRows([{ id: Date.now(), category: '', description: '', price: '', discount: '', showDiscount: false }]);
        }
    };

    const handleSubmitAll = async () => {
        if (!selectedWallet) {
            alert("Please select a wallet");
            return;
        }

        const invalidRows = rows.filter(row => !row.category || !row.description || !row.price);
        if (invalidRows.length > 0) {
            alert("Please fill in all fields (Category, Description, Price) for all rows.");
            return;
        }

        setLoading(true);
        let successCount = 0;

        for (const row of rows) {
            const data = {
                category: row.category,
                description: row.description,
                price: parseFloat(row.price),
                discount: row.discount ? parseFloat(row.discount) : 0,
                date: headerDate,
                wallet: selectedWallet
            };

            const result = await expensesTracker(data);
            if (result.status === 'success') {
                successCount++;
            }
        }

        setLoading(false);
        if (successCount === rows.length) {
            if (onFinish) onFinish();
            setRows([{ id: Date.now(), category: '', description: '', price: '', discount: '', showDiscount: false }]);
        } else if (successCount > 0) {
            alert(`Successfully added ${successCount} of ${rows.length} expenses.`);
        }
    };

    return (
        <div className="shared-form-container">
            {/* Header Section */}
            <div className="shared-form-header">
                <div className="flex items-center flex-1">
                    <LuCalendar className="ml-3 text-[var(--color-theme-secondary-text)]" size={16} />
                    <input
                        type="date"
                        className="header-field"
                        value={headerDate}
                        onChange={(e) => setHeaderDate(e.target.value)}
                    />
                </div>
                <div className="flex items-center flex-1">
                    <LuWallet className="ml-3 text-[var(--color-theme-secondary-text)]" size={16} />
                    <select
                        className="header-field"
                        value={selectedWallet}
                        onChange={(e) => setSelectedWallet(e.target.value)}
                    >
                        <option value="" disabled>Select Wallet</option>
                        {wallets.map(w => (
                            <option key={w.id} value={w.id}>{w.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Rows List */}
            <div className="shared-form-body">
                {rows.map((row, index) => (
                    <div key={row.id} className="shared-form-row">
                        <div className="shared-form-input-group">
                            <select
                                className="shared-form-field field-category"
                                value={row.category}
                                onChange={(e) => handleInputChange(row.id, 'category', e.target.value)}
                            >
                                <option value="" disabled>Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.category}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                className="shared-form-field field-description"
                                placeholder="Description"
                                value={row.description}
                                onChange={(e) => handleInputChange(row.id, 'description', e.target.value)}
                            />

                            <input
                                type="number"
                                className="shared-form-field field-price"
                                placeholder="Price"
                                value={row.price}
                                onChange={(e) => handleInputChange(row.id, 'price', e.target.value)}
                            />

                            {row.showDiscount && (
                                <input
                                    type="number"
                                    className="shared-form-field field-discount"
                                    placeholder="Disc"
                                    value={row.discount}
                                    onChange={(e) => handleInputChange(row.id, 'discount', e.target.value)}
                                />
                            )}
                        </div>

                        <div className="shared-form-actions">
                            <button
                                className={`shared-form-action-btn btn-discount ${row.showDiscount ? 'active' : ''}`}
                                onClick={() => toggleDiscount(row.id)}
                                title="Add Discount"
                            >
                                <LuBadgePercent size={18} />
                            </button>
                            <button
                                className="shared-form-action-btn btn-remove"
                                onClick={() => removeRow(row.id)}
                                title="Remove Row"
                            >
                                <LuMinus size={18} />
                            </button>

                        </div>
                    </div>
                ))}
            </div>

            {/* Add Item Button */}
            <button className="shared-form-add-more" onClick={addRow}>
                <LuPlus size={18} />
                <span>Add Item</span>
            </button>

            {/* Footer Submit */}
            <div className="shared-form-footer">
                <button
                    className={`shared-form-submit-all ${loading ? 'loading' : ''}`}
                    onClick={handleSubmitAll}
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Save Expenses'}
                </button>
            </div>
        </div>
    );
};

export default ExpensesForm;
