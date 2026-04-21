import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { income, getAllDataActiveRealTimeController } from '../../../library/firebase/controller';
import { getTodayDate, generateUniqueID } from '../../../library/utils';
import { walletStorage } from '../../../library/zustand/storage';
import { Icon } from '../../../assets/Icons';
import Big from "big.js";
const IncomeForm = ({ onFinish }) => {
    const { paramMonth } = useParams();
    const [loading, setLoading] = useState(false);

    const storedWallets = walletStorage((state) => state.data) || [];
    const [headerDate, setHeaderDate] = useState(getTodayDate());
    const [selectedWallet, setSelectedWallet] = useState(storedWallets[storedWallets.length - 1].id);
    const [wallets, setWallets] = useState([]);
    const [isWalletsFetching, setIsWalletsFetching] = useState(true);

    // Manage multiple rows
    const maxSingleRow = 3;
    const [rows, setRows] = useState([
        { id: generateUniqueID(), description: '', expected: '', amount: '' }
    ]);

    // useEffect(() => {
    //     const fetchInitialData = async () => {
    //         await getAllDataActiveRealTimeController('wallets', setWallets, setIsWalletsFetching);
    //     };
    //     fetchInitialData();
    // }, []);

    const handleInputChange = (id, field, value) => {
        setRows(rows.map(row =>
            row.id === id ? { ...row, [field]: value } : row
        ));
    };

    const addRow = () => {
        setRows([...rows, { id: generateUniqueID(), description: '', expected: '', amount: '' }]);
    };

    const removeRow = (id) => {
        if (rows.length > 1) {
            setRows(rows.filter(row => row.id !== id));
        } else {
            setRows([{ id: generateUniqueID(), description: '', expected: '', amount: '' }]);
        }
    };

    const handleSubmitAll = async () => {
        // if (!selectedWallet) {
        //     alert("Please select a wallet");
        //     return;
        // }

        // const invalidRows = rows.filter(row => !row.description || !row.expected || !row.amount);
        // if (invalidRows.length > 0) {
        //     alert("Please fill in all fields (Description, Expected, Amount) for all rows.");
        //     return;
        // }

        // setLoading(true);
        // let successCount = 0;

        for (const row of rows) {
            const data = {
                description: row.description,
                expected: new Big(row.expected),
                amount: new Big(row.amount),
                wallet: selectedWallet,
                date: headerDate,
            };

            console.log(data);
            // const result = await income(data);
            // if (result.status === 'success') {
            //     successCount++;
            // }
        }

        // setLoading(false);
        // if (successCount === rows.length) {
        //     if (onFinish) onFinish();
        //     setRows([{ id: generateUniqueID(), description: '', expected: '', amount: '' }]);
        // } else if (successCount > 0) {
        //     alert(`Successfully added ${successCount} of ${rows.length} income entries.`);
        // }
    };

    return (
        <div className="shared-form-container-v3">
            {/* Header Section */}
            <div className="shared-form-header-v3">
                <div className="flex items-center flex-1">
                    <Icon name="LuCalendar" className="ml-3 text-[var(--color-theme-secondary-text)]" size={16} />
                    <input
                        type="date"
                        className="header-field-v3"
                        value={headerDate}
                        onChange={(e) => setHeaderDate(e.target.value)}
                    />
                </div>
                <div className="flex items-center flex-1">
                    <Icon name="LuWallet" className="ml-3 text-[var(--color-theme-secondary-text)]" size={16} />
                    <select
                        className="header-field-v3"
                        value={selectedWallet}
                        onChange={(e) => setSelectedWallet(e.target.value)}
                    >
                        {storedWallets && storedWallets.length > 0 ? (
                            storedWallets.map((wallet,index) => (
                                wallet.status === 'active' && (
                                    <option key={index} value={wallet.id}>{wallet.name}</option>
                                )
                            )).reverse()
                        ) :
                            <option value="" disabled>No Wallets Found</option>
                        }
                    </select>
                </div>
            </div>
            {/* Table Header */}
            {rows.length >= maxSingleRow && (
                <div className="shared-form-table-header-v3">
                    <div className="shared-form-input-group-v3" style={{ background: 'transparent', border: 'none', borderRadius: 0 }}>
                        <div className="form-header-title field-description-v3">Income Name / Description</div>
                        <div className="form-header-title" style={{ flex: 1 }}>Expected</div>
                        <div className="form-header-title field-price-v3">Amount</div>
                    </div>
                    <div className="shared-form-actions-v3">
                        <div style={{ width: '36px' }}></div>
                    </div>
                </div>
            )}

            {/* Rows List */}
            <div className="shared-form-body">
                {rows.map((row, index) => (
                    <div key={row.id} className={`shared-form-row-v3 ${rows.length < maxSingleRow ? 'single' : ''}`}>
                        <div className={`shared-form-input-group-v3 ${rows.length < maxSingleRow ? 'single' : ''}`}>
                            <input
                                type="text"
                                className={`shared-form-field-v3 field-description-v3 ${rows.length < maxSingleRow ? 'single' : ''}`}
                                placeholder="Income Source / Description"
                                value={row.description}
                                onChange={(e) => handleInputChange(row.id, 'description', e.target.value)}
                            />

                            <input
                                type="number"
                                className={`shared-form-field-v3 field-price-v3 ${rows.length < maxSingleRow ? 'single' : ''}`}
                                placeholder="Expected"
                                value={row.expected}
                                onChange={(e) => handleInputChange(row.id, 'expected', e.target.value)}
                            />

                            <input
                                type="number"
                                className={`shared-form-field-v3 field-price-v3 ${rows.length < maxSingleRow ? 'single' : ''}`}
                                placeholder="Amount"
                                value={row.amount}
                                onChange={(e) => handleInputChange(row.id, 'amount', e.target.value)}
                            />
                        </div>

                        <div className={`shared-form-actions-v3 ${rows.length < maxSingleRow ? 'single' : ''}`}>
                            <button
                                className={`shared-form-action-btn-v3 btn-remove-v3 ${rows.length < maxSingleRow ? 'single' : ''}`}
                                onClick={() => removeRow(row.id)}
                                title="Remove Row"
                            >
                                <Icon name="LuMinus" size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Item Button */}
            <button className="shared-form-add-more-v3" onClick={addRow}>
                <Icon name="LuPlus" size={18} />
                <span>Add Income</span>
            </button>

            {/* Footer Submit */}
            <div className="shared-form-footer-v3">
                <button
                    className={`shared-form-submit-all-v3 ${loading ? 'loading' : ''}`}
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
