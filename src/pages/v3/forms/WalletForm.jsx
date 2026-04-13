import React, { useState, useEffect } from 'react';
import { LuPlus, LuMinus, LuCheck, LuWallet, LuCalendar, LuBolt } from "react-icons/lu";
import { useParams } from 'react-router-dom';
// import { bills, getAllDataActiveRealTimeController } from '../../../library/firebase/controller';
import { getTodayDate, generateUniqueID } from '../../../library/utils';
import { walletStorage } from '../../../library/zustand/storage';

const WalletForm = ({ onFinish }) => {
    const { paramMonth } = useParams();
    // console.log('paramMonth', paramMonth)
    const [loading, setLoading] = useState(false);
    const [headerDate, setHeaderDate] = useState(getTodayDate());
    const [selectedWallet, setSelectedWallet] = useState('');
    const storedWallets = walletStorage((state) => state.data) || [];

    // Manage multiple rows
    const maxSingleRow = 3;
    const [rows, setRows] = useState([
        { id: generateUniqueID(), name: '', status: '', startingBudget: '', dueDate: getTodayDate() }
    ]);

    const handleInputChange = (id, field, value) => {
        setRows(rows.map(row =>
            row.id === id ? { ...row, [field]: value } : row
        ));
    };

    const addRow = () => {
        setRows([...rows, { id: generateUniqueID(), name: '', status: '', startingBudget: '', dueDate: getTodayDate() }]);
    };

    const removeRow = (id) => {
        if (rows.length > 1) {
            setRows(rows.filter(row => row.id !== id));
        } else {
            setRows([{ id: generateUniqueID(), name: '', status: '', startingBudget: '', dueDate: getTodayDate() }]);
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
            console.log(data);

            // const result = await bills(data);
            // if (result.status === 'success') {
            //     successCount++;
            // }
        }

        // if (successCount === rows.length) {
        //     if (onFinish) onFinish();
        //     setRows([{ id: generateUniqueID(), description: '', budget: '', actual: '', dueDate: getTodayDate() }]);
        // } else if (successCount > 0) {
        //     alert(`Successfully added ${successCount} of ${rows.length} bills.`);
        // }
        setLoading(false);
    };

    return (
        <div className="shared-form-container-v3">
            {/* Header Section */}
            {/* <div className="shared-form-header-v3">
                <div className="flex items-center flex-1">
                    <LuCalendar className="ml-3 text-[var(--color-theme-secondary-text)]" size={16} />
                    <input
                        type="date"
                        className="header-field-v3"
                        value={headerDate}
                        onChange={(e) => setHeaderDate(e.target.value)}
                    />
                </div>
                <div className="flex items-center flex-1">
                    <LuWallet className="ml-3 text-[var(--color-theme-secondary-text)]" size={16} />
                    <select
                        className="header-field-v3"
                        value={selectedWallet ? selectedWallet : storedWallets[storedWallets.length - 1].id}
                        onChange={(e) => setSelectedWallet(e.target.value)}
                    >
                        {storedWallets && storedWallets.length > 0 ? (
                            storedWallets.map(wallet => (
                                wallet.status === 'active' && (
                                    <option key={wallet.id} value={wallet.id}>{wallet.name}</option>
                                )
                            )).reverse()
                        ) :
                            <option value="" disabled>No Wallets Found</option>
                        }
                    </select>
                </div>
            </div> */}

            {/* Rows List */}
            <div className="shared-form-body">
                {rows.map((row, index) => (
                    <div key={row.id} className={`shared-form-row-v3 ${rows.length < maxSingleRow ? 'single' : ''}`}>
                        <div className={`shared-form-input-group-v3 ${rows.length < maxSingleRow ? 'single' : ''}`}>
                            <input
                                type="text"
                                className={`shared-form-field-v3 ${rows.length < maxSingleRow ? 'single' : ''}`}
                                placeholder="Name / Description"
                                value={row.name}
                                onChange={(e) => handleInputChange(row.id, 'name', e.target.value)}
                            />
                            <select
                                className={`shared-form-field-v3 w-limit ${rows.length < maxSingleRow ? 'single' : ''}`}
                                value={row.status}
                                onChange={(e) => handleInputChange(row.id, 'status', e.target.value)}
                            >
                                {/* <option value="" disabled>Status</option> */}
                                <option value="active" defaultValue>Active</option>
                                <option value="inactive">Inactive</option>
                            </select>

                            <input
                                type="number"
                                className={`shared-form-field-v3 w-limit-150 ${rows.length < maxSingleRow ? 'single' : ''}`}
                                placeholder="Starting Budget (Optional)"
                                value={row.startingBudget}
                                onChange={(e) => handleInputChange(row.id, 'startingBudget', e.target.value)}
                            />
                        </div>

                        <div className="shared-form-actions-v3">
                            <button
                                className={`shared-form-action-btn-v3 btn-remove-v3 ${rows.length < maxSingleRow ? 'single' : ''}`}
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
            <button className="shared-form-add-more-v3" onClick={addRow}>
                <LuPlus size={18} />
                <span>Add More</span>
            </button>

            {/* Footer Submit */}
            <div className="shared-form-footer-v3">
                <button
                    className={`shared-form-submit-all-v3 ${loading ? 'loading' : ''} ${rows.length < maxSingleRow ? 'single' : ''}`}
                    onClick={handleSubmitAll}
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Add Wallet'}
                </button>
            </div>
        </div>
    );
};

export default WalletForm;
