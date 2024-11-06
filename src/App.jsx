import { useState } from "react";
import "./App.css";
import { faDollarSign, faUser } from "@fortawesome/free-solid-svg-icons";
import Autocomplete from "./Component/Autocomplete";

export default function App() {
    const utilisateurs = [
        { label: "Antoine", icon: faUser },
        { label: "Arthur", icon: faUser },
        { label: "Aurelien", icon: faUser },
        { label: "Gabin", icon: faUser }
    ];

    const [selectedUser, setSeletedUser] = useState();
    const [selectedProduct, setSeletedProduct] = useState();

    const search = async (term) => {
        let result = await fetch(`http://localhost:3005/user/1`, {
            method: "POST",
            body: JSON.stringify({ terms: [term] }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        let data = await result.json();
        return data.data.map(element => { return { ...element, icon: faUser, label: element.firstName + " " + element.lastName } });
    }

    const searchProduct = async (term) => {
        let result = await fetch(`http://localhost:3005/product/1`, {
            method: "POST",
            body: JSON.stringify({ terms: [term] }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        let data = await result.json();
        return data.data.map(element => { return { ...element, icon: faDollarSign, label: element.name + " " + element.price } });
    }


    const searchCombined = async (term) => {
        const [userResults, productResults] = await Promise.all([
            search(term),
            searchProduct(term)
        ]);

        return [...userResults, ...productResults];
    };



    const select = (value) => {
        setSeletedUser(value);
        setSeletedProduct(value);
    }

    return (
        <div>
            <h2>1. Autocomplete user simple avec data en props</h2>
            <Autocomplete
                options={utilisateurs}
                onItemSelect={select}
            />
            <h2> 2. Autocomplete user simple avec data en fonction</h2>
            <Autocomplete
                fetchData={search}
                onItemSelect={select}
            />

            <h2>3. Autocomplete User multiple avec data en fonction</h2>
            <Autocomplete
                fetchData={search}
                onItemSelect={select}
                allowMultiple={true}
            />

            <h2> 4. Autocomplete Product simple avec data en fonction</h2>
            <Autocomplete
                fetchData={searchProduct}
                onItemSelect={select}
            />

            <h2>5. Autocomplete Product multiple avec data en fonction</h2>
            <Autocomplete
                fetchData={searchProduct}
                onItemSelect={select}
                allowMultiple={true}
            />

            <h2>6. Autocomplete Mix multiple avec data en fonction</h2>
            <Autocomplete
                fetchData={searchCombined}
                onItemSelect={select}
                allowMultiple={true}
            />


            <h2>7. Autocomplete Product multiple avec template et data en fonction</h2>
            <Autocomplete
                fetchData={searchProduct}
                onItemSelect={select}
                allowMultiple={true}
                pathTemplate={"/src/ProductTemplate"}
            />

        </div>
    )
}