import { useState, useEffect } from 'react';
import { dashboardService } from '../services/api';

function Dashboard() {
  const [data, setData] = useState({ products: [], orders: [], functionStatus: {} });
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await dashboardService.get();
      console.log('Dashboard response:', response);
      
      // A resposta vem em response.data.data
      const dashboardData = response.data.data || response.data;
      
      setData({
        products: dashboardData.products || [],
        orders: dashboardData.orders || [],
        functionStatus: dashboardData.functionStatus || {}
      });
      setLoading(false);
    } catch (error) {
      console.error('Dashboard error:', error);
      alert('Erro ao carregar dashboard: ' + error.message);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  if (loading) return <div style={{ padding: '20px' }}>Carregando...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>  
        <h1>🍎 Hortifrut Dashboard</h1>
        <button onClick={handleLogout} style={{ padding: '10px 20px', cursor: 'pointer' }}>     
          Sair
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>

        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>        
          <h2>📦 Produtos ({data.products?.length || 0})</h2>
          {data.products?.length > 0 ? (
            <ul>
              {data.products.map(p => (
                <li key={p.id || p._id}>
                  {p.name} - R$ {p.price?.toFixed(2)} - Estoque: {p.stock}
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhum produto encontrado</p>
          )}
        </div>

        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>        
          <h2>🛒 Pedidos ({data.orders?.length || 0})</h2>
          {data.orders?.length > 0 ? (
            <ul>
              {data.orders.map(o => (
                <li key={o.id}>
                  #{o.id} - {o.customerName} - R$ {o.total?.toFixed(2)}
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhum pedido encontrado</p>
          )}
        </div>

        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', gridColumn: 'span 2' }}>
            <h2>⚡ Status Azure Functions</h2>  
            <p>Status: <strong>
                {data.functionStatus?.ok ?       
                    (data.functionStatus.message || 'available') :
                    'unavailable'
                }
            </strong></p>
            {data.functionStatus?.ok && (        
                <p style={{ color: 'green', marginTop: '5px' }}>✅ Functions operacionais</p>   
            )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
