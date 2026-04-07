import React, { useState, useEffect } from 'react';
import { LuPlus, LuMinus, LuCheck, LuWallet, LuCalendar, LuBolt } from "react-icons/lu";
import { useParams } from 'react-router-dom';
import { bills, getAllDataActiveRealTimeController } from '../../../library/firebase/controller';
import { getTodayDate, generateUniqueID } from '../../../library/utils';
import '../../../css/v2/form.css';

const BillsForm = ({ onFinish }) => {
    const { paramMonth } = useParams();
    const [loading, setLoading] = useState(false);

    // Header state
    const [headerDate, setHeaderDate] = useState(getTodayDate());
    const [selectedWallet, setSelectedWallet] = useState('');
    const [wallets, setWallets] = useState([]);
    const [isWalletsFetching, setIsWalletsFetching] = useState(true);

    // Manage multiple rows
    const [rows, setRows] = useState([
        { id: generateUniqueID(), description: '', budget: '', actual: '', dueDate: getTodayDate() }
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
        setRows([...rows, { id: generateUniqueID(), description: '', budget: '', actual: '', dueDate: getTodayDate() }]);
    };

    const removeRow = (id) => {
        if (rows.length > 1) {
            setRows(rows.filter(row => row.id !== id));
        } else {
            setRows([{ id: generateUniqueID(), description: '', budget: '', actual: '', dueDate: getTodayDate() }]);
        }
    };

    const handleSubmitAll = async () => {
        if (!selectedWallet) {
            alert("Please select a wallet");
            return;
        }

        const invalidRows = rows.filter(row => !row.description || !row.budget || !row.dueDate);
        if (invalidRows.length > 0) {
            alert("Please fill in (Description, Budget, Due Date) for all rows.");
            return;
        }

        setLoading(true);
        let successCount = 0;

        for (const row of rows) {
            const data = {
                description: row.description,
                budget: parseFloat(row.budget),
                actual: row.actual ? parseFloat(row.actual) : 0,
                dueDate: row.dueDate,
                wallet: selectedWallet,
                date: headerDate,
            };

            const result = await bills(data);
            if (result.status === 'success') {
                successCount++;
            }
        }

        if (successCount === rows.length) {
            if (onFinish) onFinish();
            setRows([{ id: generateUniqueID(), description: '', budget: '', actual: '', dueDate: getTodayDate() }]);
        } else if (successCount > 0) {
            alert(`Successfully added ${successCount} of ${rows.length} bills.`);
        }
        setLoading(false);
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
                                placeholder="Bill Name / Description"
                                value={row.description}
                                onChange={(e) => handleInputChange(row.id, 'description', e.target.value)}
                            />

                            <input
                                type="date"
                                className="shared-form-field-v2"
                                style={{ fontSize: '0.8rem' }}
                                value={row.dueDate}
                                onChange={(e) => handleInputChange(row.id, 'dueDate', e.target.value)}
                            />

                            <input
                                type="number"
                                className="shared-form-field-v2 field-price-v2"
                                placeholder="Budget"
                                value={row.budget}
                                onChange={(e) => handleInputChange(row.id, 'budget', e.target.value)}
                            />

                            <input
                                type="number"
                                className="shared-form-field-v2 field-price-v2"
                                placeholder="Actual"
                                value={row.actual}
                                onChange={(e) => handleInputChange(row.id, 'actual', e.target.value)}
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
                <span>Add Bill</span>
            </button>

            {/* Footer Submit */}
            <div className="shared-form-footer-v2">
                <button
                    className={`shared-form-submit-all-v2 ${loading ? 'loading' : ''}`}
                    onClick={handleSubmitAll}
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Save Bills'}
                </button>
            </div>
        </div>
    );
};

export default BillsForm;
