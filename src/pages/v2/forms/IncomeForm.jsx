import React, { useState, useEffect } from 'react';
import { LuPlus, LuMinus, LuCheck, LuWallet, LuCalendar, LuHandCoins } from "react-icons/lu";
import { useParams } from 'react-router-dom';
import { income, getAllDataActiveRealTimeController } from '../../../library/firebase/controller';
import { getTodayDate } from '../../../library/firebase/utils';
import '../../../css/v2/v2-form.css';

const IncomeForm = ({ onFinish }) => {
    const { paramMonth } = useParams();
    const [loading, setLoading] = useState(false);

    // Header state
    const [headerDate, setHeaderDate] = useState(getTodayDate());
    const [selectedWallet, setSelectedWallet] = useState('');
    const [wallets, setWallets] = useState([]);
    const [isWalletsFetching, setIsWalletsFetching] = useState(true);

    // Manage multiple rows
    const [rows, setRows] = useState([
        { id: Date.now(), description: '', expected: '', amount: '' }
    ]);

    useEffect(() => {
        const fetchInitialData = async () => {
            await getAllDataActiveRealTimeController('wallets', setWallets, setIsWalletsFetching);
        };
        fetchInitialData();
    }, []);

    const handleInputChange = (id, field, value) => {
        setRows(rows.map(row =>
            row.id === id ? { ...row, [field]: value } : row
        ));
    };

    const addRow = () => {
        setRows([...rows, { id: Date.now(), description: '', expected: '', amount: '' }]);
    };

    const removeRow = (id) => {
        if (rows.length > 1) {
            setRows(rows.filter(row => row.id !== id));
        } else {
            setRows([{ id: Date.now(), description: '', expected: '', amount: '' }]);
        }
    };

    const handleSubmitAll = async () => {
        if (!selectedWallet) {
            alert("Please select a wallet");
            return;
        }

        const invalidRows = rows.filter(row => !row.description || !row.expected || !row.amount);
        if (invalidRows.length > 0) {
            alert("Please fill in all fields (Description, Expected, Amount) for all rows.");
            return;
        }

        setLoading(true);
        let successCount = 0;

        for (const row of rows) {
            const data = {
                description: row.description,
                expected: parseFloat(row.expected),
                amount: parseFloat(row.amount),
                wallet: selectedWallet,
                date: headerDate,
            };

            const result = await income(data);
            if (result.status === 'success') {
                successCount++;
            }
        }

        setLoading(false);
        if (successCount === rows.length) {
            if (onFinish) onFinish();
            setRows([{ id: Date.now(), description: '', expected: '', amount: '' }]);
        } else if (successCount > 0) {
            alert(`Successfully added ${successCount} of ${rows.length} income entries.`);
        }
    };

    return (
        <div className="shared-form-container-v2">
            {/* Header Section */}
            <div className="shared-form-header-v2">
                <div className="flex items-center flex-1">
                    <LuCalendar className="ml-3 text-[var(--color-theme-secondary-text)]" size={16} />
                    <input
                        type="date"
                        className="header-field-v2"
                        value={headerDate}
                        onChange={(e) => setHeaderDate(e.target.value)}
                    />
                </div>
                <div className="flex items-center flex-1">
                    <LuWallet className="ml-3 text-[var(--color-theme-secondary-text)]" size={16} />
                    <select
                        className="header-field-v2"
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
                    <div key={row.id} className="shared-form-row-v2">
                        <div className="shared-form-input-group-v2">
                            <input
                                type="text"
                                className="shared-form-field-v2 field-description-v2"
                                placeholder="Income Source / Description"
                                value={row.description}
                                onChange={(e) => handleInputChange(row.id, 'description', e.target.value)}
                            />

                            <input
                                type="number"
                                className="shared-form-field-v2 field-price-v2"
                                placeholder="Expected"
                                value={row.expected}
                                onChange={(e) => handleInputChange(row.id, 'expected', e.target.value)}
                            />

                            <input
                                type="number"
                                className="shared-form-field-v2 field-price-v2"
                                placeholder="Amount"
                                value={row.amount}
                                onChange={(e) => handleInputChange(row.id, 'amount', e.target.value)}
                            />
                        </div>

                        <div className="shared-form-actions-v2">
                            <button
                                className="shared-form-action-btn-v2 btn-remove-v2"
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
            <button className="shared-form-add-more-v2" onClick={addRow}>
                <LuPlus size={18} />
                <span>Add Income</span>
            </button>

            {/* Footer Submit */}
            <div className="shared-form-footer-v2">
                <button
                    className={`shared-form-submit-all-v2 ${loading ? 'loading' : ''}`}
                    onClick={handleSubmitAll}
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Save Income'}
                </button>
            </div>
        </div>
    );
};

export default IncomeForm;
