  export default function MarkerForm({newMarker, formData, setFormData, Xuly}) {
    if(!newMarker) return null;
  
  return (
        <form
          onSubmit={Xuly}
          style={{
            position: "absolute",
            top:20,
            left:"50%",
            zIndex:1000,
            transform: "translateX(-50%)",

            background: "white",
            padding: "10px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
          >
            <h4>Thêm marker mới </h4>
            <input
            type= "text"
            placeholder= "Tên"
            value= {formData.name}
            onChange={(a) => setFormData({...formData,name:a.target.value})}
            required
          />
          <br />
          <textarea
            placeholder="Mô tả"
            value= {formData.desc}
            onChange={(a) => setFormData({...formData, desc:a.target.value})}
            required
          />
          <br />
          <button type= "submit">Lưu Marker</button> 
        </form>
      );
    }
    