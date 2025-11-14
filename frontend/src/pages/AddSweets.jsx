import React, { useState } from "react";

const AddSweets = () => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!name.trim()) return setError("Name is required.");
        if (!price || Number.isNaN(Number(price))) return setError("Valid price is required.");
        if (imageUrl && !isValidUrl(imageUrl)) return setError("Image URL is not valid.");

        const payload = {
            name: name.trim(),
            price: Number(price),
            imageUrl: imageUrl.trim(),
            description: description.trim(),
        };

        try {
            // Replace the URL below with your backend endpoint if you have one.
            const res = await axios.post("/api/sweets", {
                withCredentials: true,
                ...payload
            });

            if (!res.ok) throw new Error("Failed to add sweet (server responded with error).");

            setSuccess("Sweet added successfully.");
            setName("");
            setPrice("");
            setImageUrl("");
            setDescription("");
        } catch (err) {
            setError(err.message || "Something went wrong.");
        }
    };

    return (
        <div style={{ maxWidth: 640, margin: "0 auto", padding: 12 }}>
            <h2>Add Sweet</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 8 }}>
                    <label>Name</label>
                    <br />
                    <input value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <div style={{ marginBottom: 8 }}>
                    <label>Price</label>
                    <br />
                    <input
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        type="number"
                        step="0.01"
                        required
                    />
                </div>

                <div style={{ marginBottom: 8 }}>
                    <label>Image URL</label>
                    <br />
                    <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                </div>

                {imageUrl && isValidUrl(imageUrl) && (
                    <div style={{ marginBottom: 8 }}>
                        <img
                            src={imageUrl}
                            alt="preview"
                            style={{ maxWidth: "100%", maxHeight: 240, objectFit: "contain", border: "1px solid #eee" }}
                        />
                    </div>
                )}

                <div style={{ marginBottom: 8 }}>
                    <label>Description</label>
                    <br />
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
                </div>

                <div>
                    <button type="submit">Add Sweet</button>
                </div>

                {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
                {success && <div style={{ color: "green", marginTop: 8 }}>{success}</div>}
            </form>
        </div>
    );
}
export default AddSweets;