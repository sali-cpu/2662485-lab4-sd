document.getElementById("clickCount").addEventListener("click", async function() {
    const countryName = document.getElementById("count").value.trim();
    if (!countryName) {
        alert("Please enter a country name.");
        return;
    }

    const countryInfoSection = document.getElementById("country-info");
    const bordersSection = document.getElementById("bordering-countries");

    countryInfoSection.innerHTML = "<p>Loading...</p>";
    bordersSection.innerHTML = "";

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
        if (!response.ok) throw new Error("Country not found");

        const [country] = await response.json();
        const { capital, population, region, flags, borders } = country;

        countryInfoSection.innerHTML = `
            <h2>${countryName}</h2>
            <p><strong>Capital:</strong> ${capital}</p>
            <p><strong>Population:</strong> ${population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${region}</p>
            <img src="${flags.svg}" alt="Flag of ${countryName}" class="country-flag">
        `;

        if (borders) {
            bordersSection.innerHTML = "<h3>Bordering Countries:</h3>";
            for (let borderCode of borders) {
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${borderCode}`);
                const [borderCountry] = await borderResponse.json();
                bordersSection.innerHTML += `
                    <p>${borderCountry.name.common}</p>
                    <img src="${borderCountry.flags.svg}" alt="Flag of ${borderCountry.name.common}" class="border-flag">
                `;
            }
        } else {
            bordersSection.innerHTML = "<p>No bordering countries.</p>";
        }
    } catch (error) {
        countryInfoSection.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
    }
});
