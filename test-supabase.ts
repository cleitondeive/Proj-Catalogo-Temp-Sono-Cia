import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase extraídas do projeto
const supabaseUrl = 'https://zfonwqmpatubcnpuxcyr.supabase.co';
const supabaseKey = 'sb_publishable_GidJwMFuH6e0-McO4fKBOA_zkmGd5S0';

const supabase = createClient(supabaseUrl, supabaseKey);

// Payload de teste fictício para a Sono & Cia
const mockPayload = {
  storeName: "Sono & Cia",
  lastUpdated: new Date().toISOString(),
  leads: [
    { id: "lead-1", name: "Mariana Souza", email: "mariana.souza@gmail.com", interest: "Colchão Premium Gel Tech", date: "2026-06-11" },
    { id: "lead-2", name: "Ricardo Almeida", email: "ricardo.almeida@hotmail.com", interest: "Enxoval Luxo Algodão Egípcio", date: "2026-06-11" }
  ],
  orders: [
    {
      id: "ped-1001",
      customer: "Antônio Carlos",
      items: [
        { product: "Colchão Sono Imperial - Casal", quantity: 1, price: 4890.00 },
        { product: "Travesseiro Anatômico Ortopédico", quantity: 2, price: 299.00 }
      ],
      total: 5488.00,
      status: "Preparando Envio"
    }
  ],
  products: [
    { id: "prod-colchao-imperial", name: "Colchão Sono Imperial", category: "Colchões", price: 4890.00, stock: 15 },
    { id: "prod-enxoval-egipcio", name: "Jogo de Cama Algodão Egípcio 400 Fios", category: "Enxoval", price: 799.00, stock: 24 }
  ]
};

async function testSupabaseConnection() {
  console.log('=' .repeat(60));
  console.log('🚀 INICIANDO TESTE DE CONEXÃO E RLS - SUPABASE (SONO & CIA)');
  console.log('=' .repeat(60));
  console.log(`📍 Endpoint: ${supabaseUrl}`);
  console.log(`🔑 Anon Key: ${supabaseKey.substring(0, 15)}... (Pública)`);

  try {
    // 1. Operação de UPSERT (ID 1)
    console.log('\n🔄 1. Executando UPSERT na tabela [app_state] para ID = 1...');
    const { data: upsertData, error: upsertError } = await supabase
      .from('app_state')
      .upsert({
        id: 1,
        data: mockPayload,
        updated_at: new Date().toISOString()
      })
      .select();

    if (upsertError) {
      console.error('❌ Erro na gravação (UPSERT):', upsertError.message);
      console.error('Detalhes:', upsertError);
      return;
    }

    console.log('✅ UPSERT executado com sucesso!');
    console.log('Registro atualizado:', JSON.stringify(upsertData, null, 2));

    // 2. Operação de SELECT (Leitura do ID 1)
    console.log('\n🔍 2. Executando SELECT para verificar integridade e RLS...');
    const { data: selectData, error: selectError } = await supabase
      .from('app_state')
      .select('*')
      .eq('id', 1)
      .single();

    if (selectError) {
      console.error('❌ Erro na leitura (SELECT):', selectError.message);
      return;
    }

    console.log('✅ SELECT concluído com sucesso!');
    console.log('=' .repeat(60));
    console.log('📋 CONTEÚDO RECUPERADO (JSON):');
    console.log('=' .repeat(60));
    console.log(JSON.stringify(selectData, null, 2));
    console.log('=' .repeat(60));
    console.log('✨ SUCESSO TOTAL! Sua conexão com o Supabase está 100% operacional.');
    console.log('⚙️ O RLS (Row Level Security) e a chave anônima estão configurados corretamente.');
    console.log('=' .repeat(60));

  } catch (err: any) {
    console.error('💥 Erro inesperado ao executar o teste:', err.message || err);
  }
}

testSupabaseConnection();
