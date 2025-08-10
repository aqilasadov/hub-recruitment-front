import Card from "components/Card/Card";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Form, Formik } from "formik";
import { Autocomplete, Icon, MenuItem, TextField, Box, Typography, IconButton } from "@mui/material";
import FormField from "layouts/applications/wizard/components/FormField";
import { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Edit from "assets/images/icons/pencil-alt.svg";
import Delete from "assets/images/icons/trash.svg";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const currencies = ["AZN", "USD", "EUR"];
const units = ["Ədəd", "Kq", "Litr"];
const edvOptions = ["0%", "1%", "18%"];

const initialProduct = {
    code: "",
    name: "",
    currency: "",
    quantity: "",
    unit: "",
    edv: "",
    smeta: "",
    total: "",
};

function ProductTable({
    showForm,
    setShowForm,
    form,
    setForm,
    editIndex,
    setEditIndex,
    products,
    setProducts,
}) {
    const handleSave = () => {
        if (
            !form.code ||
            !form.name ||
            !form.currency ||
            !form.quantity ||
            !form.unit ||
            !form.edv ||
            !form.smeta ||
            !form.total
        ) {
            return;
        }
        if (editIndex !== null) {
            const updated = [...products];
            updated[editIndex] = form;
            setProducts(updated);
        } else {
            setProducts([...products, form]);
        }
        setForm(initialProduct);
        setShowForm(false);
        setEditIndex(null);
    };

    const handleCancel = () => {
        setForm(initialProduct);
        setShowForm(false);
        setEditIndex(null);
    };

    const handleEdit = (idx) => {
        setForm(products[idx]);
        setShowForm(true);
        setEditIndex(idx);
    };

    const handleDelete = (idx) => {
        setProducts(products.filter((_, i) => i !== idx));
        if (editIndex === idx) handleCancel();
    };

    return (
        <MDBox sx={{ p: 3, borderRadius: 3, bgcolor: "#fff", boxShadow: 1 }}>
            {/* Table Header */}
            <MDBox display="flex" borderBottom="1px solid #eee" pb={1} mb={1}>
                {["Malın kodu", "Malın adı", "Valyuta", "Miqdar", "Ölçü vahidi", "ƏDV", "Smeta kodu", "Yekun", ""].map((h, i) => (
                    <MDTypography
                        key={h}
                        flex={i === 8 ? "0 0 80px" : 1}
                        fontWeight="medium"
                        color="text.secondary"
                        fontSize={14}
                        pl={i === 0 ? 0 : 2}
                    >
                        {h}
                    </MDTypography>
                ))}
            </MDBox>

            {/* Data Rows */}
            {products.map((row, idx) => (
                <MDBox key={idx} display="flex" alignItems="center" py={1}>
                    <Typography flex={1} fontSize={14}>{row.code}</Typography>
                    <Typography flex={1} fontSize={14}>{row.name}</Typography>
                    <Typography flex={1} fontSize={14}>{row.currency}</Typography>
                    <Typography flex={1} fontSize={14}>{row.quantity}</Typography>
                    <Typography flex={1} fontSize={14}>{row.unit}</Typography>
                    <Typography flex={1} fontSize={14}>{row.edv}</Typography>
                    <Typography flex={1} fontSize={14}>{row.smeta}</Typography>
                    <Typography flex={1} fontSize={14}>{row.total}</Typography>
                    <MDBox flex="0 0 80px" display="flex" gap={1}>
                        <IconButton size="small" onClick={() => handleEdit(idx)}>
                            <img src={Edit} alt="Edit" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(idx)}>
                            <img src={Delete} alt="Delete" />
                        </IconButton>
                    </MDBox>
                </MDBox>
            ))}

            {/* Form Row */}
            {showForm && (
                <MDBox display="flex" alignItems="center" borderBottom="1px solid #eee" py={1} mt={1}>
                    <MDInput
                        variant="standard"
                        placeholder="Malın kodu"
                        value={form.code}
                        onChange={e => setForm({ ...form, code: e.target.value })}
                        sx={{ flex: 1, mx: 0.5 }}
                    />
                    <MDInput
                        variant="standard"
                        placeholder="Malın adı"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        sx={{ flex: 1, mx: 0.5 }}
                    />
                    <Autocomplete
                        options={currencies}
                        value={form.currency}
                        onChange={(_, newValue) => setForm({ ...form, currency: newValue || "" })}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="standard"
                                placeholder="Valyuta"
                                sx={{ flex: 1, mx: 0.5 }}
                                InputProps={{
                                    ...params.InputProps,
                                    disableUnderline: false,
                                }}
                            />
                        )}
                        sx={{ flex: 1, mx: 0.5 }}
                    />
                    <MDInput
                        variant="standard"
                        placeholder="Miqdar"
                        value={form.quantity}
                        onChange={e => setForm({ ...form, quantity: e.target.value })}
                        sx={{ flex: 1, mx: 0.5 }}
                    />
                    <Autocomplete
                        options={units}
                        value={form.unit}
                        onChange={(_, newValue) => setForm({ ...form, unit: newValue || "" })}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="standard"
                                placeholder="Ölçü vahidi"
                                sx={{ flex: 1, mx: 0.5 }}
                                InputProps={{
                                    ...params.InputProps,
                                    disableUnderline: false,
                                }}
                            />
                        )}
                        sx={{ flex: 1, mx: 0.5 }}
                    />
                    <Autocomplete
                        options={edvOptions}
                        value={form.edv}
                        onChange={(_, newValue) => setForm({ ...form, edv: newValue || "" })}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="standard"
                                placeholder="ƏDV"
                                sx={{ flex: 1, mx: 0.5 }}
                                InputProps={{
                                    ...params.InputProps,
                                    disableUnderline: false,
                                }}
                            />
                        )}
                        sx={{ flex: 1, mx: 0.5 }}
                    />
                    <MDInput
                        variant="standard"
                        placeholder="Smeta kodu"
                        value={form.smeta}
                        onChange={e => setForm({ ...form, smeta: e.target.value })}
                        sx={{ flex: 1, mx: 0.5 }}
                    />
                    <MDInput
                        variant="standard"
                        placeholder="Yekun"
                        value={form.total}
                        onChange={e => setForm({ ...form, total: e.target.value })}
                        sx={{ flex: 1, mx: 0.5 }}
                        fontSize={"size.sm"}
                        
                    />
                    <MDBox flex="0 0 80px" display="flex" gap={1} justifyContent="flex-end">
                        <IconButton sx={{ bgcolor: "#e6f4ea", color: "#388e3c", border: "1px solid #A5D6A7", borderRadius: "8px", "&:hover": { bgcolor: "#c8e6c9" } }} onClick={handleSave}>
                            <CheckIcon fontSize="small" />
                        </IconButton>
                        <IconButton sx={{ bgcolor: "#ffebee", color: "#d32f2f", borderRadius: "8px", border: "1px solid #EF9A9A", "&:hover": { bgcolor: "#ffcdd2" } }} onClick={handleCancel}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </MDBox>
                </MDBox>
            )}
        </MDBox>
    );
}

function NewPayment() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [isEditMode, setIsEditMode] = useState(false);
    const [initialValues, setInitialValues] = useState({
        registrationNumber: '',
        purchaseSubject: '',
        customer: '',
        contractor: '',
        contractorType: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        amount: '',
        currency: '',
        paymentType: '',
        paymentDate: new Date().toISOString().split('T')[0],
        paymentStatus: '',
    });
    const [products, setProducts] = useState([
        {
            code: "ORD-2025-007",
            name: "MQ-26-007",
            currency: "AZN",
            quantity: "12",
            unit: "Ədəd",
            edv: "120",
            smeta: "123456",
            total: "720",
        },
    ]);


        // Mövcud müqavilənin məlumatlarını yükləyirik
        useEffect(() => {
            if (userId) {
                setIsEditMode(true);
                // API-dən müqavilə məlumatlarını alırıq
                const fetchPaymentData = async () => {
                    try {
                        const response = await axios.get(`https://jsonplaceholder.typicode.com/todos/${userId}`);
                        // API-dən gələn məlumatları initialValues formatına çeviririk
                        setInitialValues({
                            ...initialValues,
                            registrationNumber: response.data.userId,
                            purchaseSubject: response.data.id,
                            customer: response.data.title,
                            // Digər məlumatları da əlavə edirik
                        });
                    } catch (error) {
                       
                    }
                };
                fetchPaymentData();
            }
        }, [userId]);
    
        const handleSubmit = async (values) => {
            try {
                if (isEditMode) {
                    // Mövcud müqaviləni yeniləyirik
                    await axios.put(`https://jsonplaceholder.typicode.com/todos/${userId}`, values);
                } else {
                    // Yeni müqavilə yaradırıq
                    await axios.post('https://jsonplaceholder.typicode.com/todos', values);
                }
                navigate('/modules/payments');
            } catch (error) {
              
            }
        };
    

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <MDBox mb={3}>
                    <Card>
                        <MDBox p={3} lineHeight={1}>
                                <Formik 
                                    initialValues={initialValues} 
                                    onSubmit={handleSubmit}
                                    enableReinitialize
                                >
                                    {({ values, handleChange, handleSubmit }) => (
                                <Form>
                                    <MDBox display="flex" justifyContent="space-between" alignItems="start" mb={4}>
                                        <MDBox>
                                            <MDTypography variant="h5" fontWeight="medium" mb={1}>
                                                {isEditMode ? 'Ödənişi redaktə et' : 'Yeni ödəniş əlavə et'}
                                            </MDTypography>
                                            <MDTypography variant="body2" color="text" fontSize={14}>
                                                Ödənişin məlumatlarını daxil edin
                                            </MDTypography>
                                        </MDBox>
                                        <MDBox display="flex" gap={2}>
                                            <MDButton variant="gradient" color="dark" onClick={() => navigate("/modules/payments")} sx={{
                                                color: "darkBlue.main",
                                                background: "linear-gradient(45deg, #D1D6DC, #E5E9EF)",
                                                boxShadow: "0px 4px 10px rgba(151, 172, 198, 0.25)",
                                                "&:hover": {
                                                    background: "linear-gradient(45deg, #D1D6DC, #E5E9EF)",
                                                    boxShadow: "0px 4px 10px rgba(151, 172, 198, 0.25)"
                                                }
                                            }}>
                                                İmtina et
                                            </MDButton>
                                            <MDButton variant="gradient" color="info" sx={{
                                                background: "linear-gradient(45deg, #3E3D45, #202020)",
                                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
                                                "&:hover": {
                                                    background: "linear-gradient(45deg, #3E3D45, #202020)",
                                                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)"
                                                }
                                            }}>
                                                Yadda saxla
                                            </MDButton>
                                        </MDBox>
                                    </MDBox>
                                    <MDBox>
                                        <MDBox display="flex" flexDirection="column" gap={5} mb={4} px={3}>
                                            <MDBox display="flex" gap={5}>
                                                <MDInput variant="standard" type="text" name="registrationNumber" value={values.registrationNumber} onChange={handleChange} placeholder="Ödəniş nömrəsi*" required sx={{ width: "100%" }}  />
                                                <MDInput variant="standard" type="date" placeholder="Ödəniş tarixi*" required sx={{ width: "100%" }} />
                                                <MDInput variant="standard" type="text" placeholder="Məbləğ" required sx={{ width: "100%" }} />
                                                <Autocomplete
                                                    options={["option1", "option2"]}
                                                    renderInput={(params) => (
                                                        <FormField {...params} placeholder="Valyuta" InputLabelProps={{ shrink: true }} />
                                                    )}
                                                    sx={{ width: "100%" }}
                                                />
                                               
                                            </MDBox>
                                            <MDBox display="flex" gap={5}>
                                            <Autocomplete
                                                    options={["option1", "option2"]}
                                                    renderInput={(params) => (
                                                        <FormField {...params} placeholder="Kontragent" InputLabelProps={{ shrink: true }} />
                                                    )}
                                                    sx={{ width: "100%" }}
                                                />
                                               
                                                <MDInput variant="standard" type="text" placeholder="Ödəniş növü" required sx={{ width: "100%" }} />
                                            </MDBox>
                                        </MDBox>
                                    </MDBox>
                                </Form>
                                )}
                            </Formik>
                        </MDBox>
                    </Card>
                </MDBox>
                
            </MDBox>
        </DashboardLayout>
    );
}

export default NewPayment;














