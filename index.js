const express = require('express'); // ou o framework que você está usando
const app = express();
const PORT = process.env.PORT || 10000; // Usa a porta do ambiente ou 10000 como padrão
const fetch = require('node-fetch'); // Certifique-se de ter node-fetch instalado


const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
const bot = new Telegraf('7698609915:AAEkiUAnLMk5Y_gysga3VkzOsHWX67EFcuQ');

// Endpoint para a raiz
app.get('/', (req, res) => {
    res.send('Bot está funcionando!');
});

// Inicia o servidor
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Ajuste os timeouts conforme necessário
server.keepAliveTimeout = 120000; // 120 segundos
server.headersTimeout = 120000; // 120 segundos

// Teste de conexão com o Telegram
async function testeTelegramAPI() {
    try {
        const response = await fetch(`https://api.telegram.org/bot7698609915:AAEkiUAnLMk5Y_gysga3VkzOsHWX67EFcuQ/getMe`, { timeout: 30000 });
        const data = await response.json();
        console.log("Conexão bem-sucedida com a API do Telegram:", data);
    } catch (err) {
        console.error("Erro ao conectar com a API do Telegram:", err.message);
    }
}

testeTelegramAPI();

// URL base da API
const API_BASE_URL = 'https://api.pushinpay.com.br/api';

// Define a chave da API do Pushin Pay
const PUSHIN_PAY_API_KEY = '1720|hZ42SlgkeM27SP6J1oJWR5I3hgmqKg988TtQtJsE5f93fe73';

// URL do webhook do Google Apps Script
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyDQcqIAgAqDLBZ_w_gVjHIRAQdHxtgCznjUqkY-s304yAsMcy_8VQaCgDR2CSH1Sq9/exec';

// ID do administrador (substitua pelo ID do seu administrador)
const adminId = '5308694170';
// Variável para armazenar o nome do bot
let botName = '';
let messageKeys = {};
// Armazenar IDs de mensagens
	const usersCooldown = new Map();
	const mensagemInicialMessageIds = {};
	const luxuriaMessageIds = {};
	const fantasiaMessageIds = {};
	const feitiçoMessageIds = {};
	const toEsperandoMessageIds = {};
	const paymentChoiceMessageIds = {};
	const generatingPaymentMessageIds = {};
	const generatingMessageIds = {};
	const successPaymentMessageIds = {};
	const generatingCheckoutMessageIds = {};
	const qrCodeMessageIds = {};
	const jaPagouMessageIds = {};
	const verificationMessageIds = {};
	const verificarNovamenteMessageIds = {};
	const vique1MessageIds = {};
	const vique2MessageIds = {};
	const vique3MessageIds = {};
	const desc1MessageIds = {};
	const desc2MessageIds = {};
	const desc3MessageIds = {};
	const okAmorMessageIds = {};
	const bemVindoMessageIds = {};
	const bemVindo2MessageIds = {};
	const oportunidadeMessageIds = {};
	const oportunidade2MessageIds = {};
	const upsellMessageIds = {};

// Objeto para armazenar os valores dos pacotes
const precosPacotes = {
    Feitiço: 2990,  
    Fantasia: 4990,  
    Luxuria: 6990,
    Pezinho: 14700,
};

// Função para obter o nome do bot
async function obterNomeBot() {
    const me = await bot.telegram.getMe();
    botName = me.first_name; 
}









// Iniciar o bot e chamar a função de boas-vindas
bot.start(async (ctx) => {
	
	
		const userId = ctx.from.id;

    // Verifica se o usuário já está no Map
    if (usersCooldown.has(userId)) {
        // ctx.reply("Você já iniciou o bot recentemente. Aguarde um pouco antes de reiniciar.");
        return;
    }

    // Se não está no Map, adiciona e define o timer de 10 minutos (600.000 ms)
    usersCooldown.set(userId, true);

    // Define o temporizador para remover o usuário após 10 minutos
    setTimeout(() => {
        usersCooldown.delete(userId);
    }, 10 * 60 * 1000); // 10 minutos em milissegundos
	
 await iniciarFluxoDeConteudo(ctx);
 
 const dadosParaGoogleSheets = {
                data_hora: new Date().toISOString(),
                id_chat_cliente: ctx.chat.id,
                nome_usuario: ctx.from.username || ctx.from.first_name,
                evento: ctx.from.first_name,
				nome_bot: botName 
            };
            await enviarDadosParaGoogleSheets(dadosParaGoogleSheets);
 
 });


// Função para buscar todos os IDs únicos dos usuários no Google Sheets
async function buscarClientes() {
    try {
        const response = await axios.get(GOOGLE_SHEETS_URL);

        if (response.data.values && Array.isArray(response.data.values)) {
            const data = response.data.values;
            const clienteIds = new Set();

            // Ignora a primeira linha (cabeçalhos) e itera sobre os registros
            for (const row of data.slice(1)) {
                if (row[1] && row[8] === botName) {  // Coluna B é o ID do chat
                    clienteIds.add(row[1].toString()); // Adiciona o ID como string para evitar duplicatas
                }
            }
			

            return Array.from(clienteIds);
        } else {
            return [];
        }
    } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        return [];
    }
}

















// Função para processar a mensagem recebida e gerar os dados necessários
async function processarMensagem(ctx) {
    let mensagem;
    let contentToSend = ""; // Inicializa contentToSend como uma string vazia

    if (ctx.message.text) {
        mensagem = { type: 'text', content: ctx.message.text };
        contentToSend = ctx.message.text;
    } else if (ctx.message.audio) {
        mensagem = { type: 'audio', file_id: ctx.message.audio.file_id };
    } else if (ctx.message.voice) {
        mensagem = { type: 'voice', file_id: ctx.message.voice.file_id };
    } else if (ctx.message.video) {
        mensagem = { type: 'video', file_id: ctx.message.video.file_id };
        contentToSend = ctx.message.caption || ""; // Define contentToSend com a legenda do vídeo
    } else if (ctx.message.photo) {
        mensagem = { type: 'photo', file_id: ctx.message.photo[ctx.message.photo.length - 1].file_id };
        contentToSend = ctx.message.caption || ""; // Define contentToSend com a legenda da foto
    } else if (ctx.message.document) {
        mensagem = { type: 'document', file_id: ctx.message.document.file_id, file_name: ctx.message.document.file_name };
    } else if (ctx.message.sticker) {
        mensagem = { type: 'sticker', file_id: ctx.message.sticker.file_id };
    } else {
        mensagem = { type: 'unknown', content: "Mensagem recebida, mas tipo não reconhecido.", raw: ctx.message };
        console.log("Mensagem não reconhecida:", ctx.message);
        console.log("Mensagem não reconhecida:", JSON.stringify(ctx.message, null, 2));
    }

    console.log("Mensagem recebida:", mensagem);

    // Gera uma chave única para a mensagem
    const messageKey = generateUniqueKey(); // Função para gerar uma chave única
    messageKeys[messageKey] = {}; // Cria um novo objeto para armazenar os IDs da mensagem
    console.log(`Chave da mensagem armazenada: ${messageKey}`);
	
	   


	

    // Processa os botões inline antes de enviar a mensagem
    const inlineButtons = [];

    // Identifica valores e links nas mensagens
    const valores = [...contentToSend.matchAll(/\$\$(\d+)\s*(.+)?/g)];
    valores.forEach((valorMatch) => {
        const valorCentavos = parseInt(valorMatch[1]);
        const valorReais = (valorCentavos / 100).toFixed(2).replace('.', ',');

        let textoBotao = `Desbloquear por R$ ${valorReais}`; // Texto padrão
        if (valorMatch[2]) {
            textoBotao = valorMatch[2].trim(); // Usa o texto após o valor, se disponível
        }

        inlineButtons.push([{
            text: textoBotao,
            callback_data: `gerar_pagamento:${valorCentavos}`
        }]);

        // Remove o valor processado da mensagem
        contentToSend = contentToSend.replace(valorMatch[0], '').trim();
    });

    const links = [...contentToSend.matchAll(/##(https?:\/\/[^\s]+)\s*(.*?)$/gm)];
    links.forEach((linkMatch) => {
        const linkUrl = linkMatch[1];
        let linkTexto = 'Clique aqui'; // Texto padrão

        if (linkMatch[2]) {
            linkTexto = linkMatch[2].trim();
        }

        inlineButtons.push([{
            text: linkTexto,
            url: linkUrl
        }]);

        // Remove o link processado da mensagem
        contentToSend = contentToSend.replace(linkMatch[0], '').trim();
    });

    return { mensagem, contentToSend, inlineButtons, messageKey };
	
	    

}




async function enviarMensagem(bot, clienteIds, mensagem, inlineButtons, contentToSend, messageKey, messageKeys) {
    // Inicializa a chave de mensagens se necessário
    messageKeys[messageKey] = messageKeys[messageKey] || {};

    // Validações básicas
    if (!Array.isArray(clienteIds) || clienteIds.length === 0) {
        console.error("Nenhum cliente especificado.");
        return;
    }

    if (!mensagem || !mensagem.type) {
        console.error("Mensagem inválida fornecida.");
        return;
    }

    for (const clientId of clienteIds) {
        try {
            let sentMessage;
            switch (mensagem.type) {
                case 'text':
                    sentMessage = await bot.telegram.sendMessage(clientId, contentToSend.trim(), {
                        reply_markup: {
                            inline_keyboard: inlineButtons
                        }
                    });
                    break;
                case 'audio':
                    sentMessage = await bot.telegram.sendAudio(clientId, mensagem.file_id, {
                        reply_markup: {
                            inline_keyboard: inlineButtons
                        }
                    });
                    break;
                case 'voice':
                    sentMessage = await bot.telegram.sendVoice(clientId, mensagem.file_id, {
                        reply_markup: {
                            inline_keyboard: inlineButtons
                        }
                    });
                    break;
                case 'video':
                    sentMessage = await bot.telegram.sendVideo(clientId, mensagem.file_id, {
                        caption: contentToSend.trim(),
                        reply_markup: {
                            inline_keyboard: inlineButtons
                        }
                    });
                    break;
                case 'photo':
                    sentMessage = await bot.telegram.sendPhoto(clientId, mensagem.file_id, {
                        caption: contentToSend.trim(),
                        reply_markup: {
                            inline_keyboard: inlineButtons
                        }
                    });
                    break;
                case 'document':
                    sentMessage = await bot.telegram.sendDocument(clientId, mensagem.file_id, {
                        caption: mensagem.file_name,
                        reply_markup: {
                            inline_keyboard: inlineButtons
                        }
                    });
                    break;
                case 'sticker':
                    sentMessage = await bot.telegram.sendSticker(clientId, mensagem.file_id);
                    break;
                default:
                    console.log("Tipo de mensagem não reconhecido.");
                    continue;
            }

            // Armazena o ID da mensagem no objeto de chaves
            if (!messageKeys[messageKey]) {
                messageKeys[messageKey] = {};
            }
            messageKeys[messageKey][clientId] = sentMessage.message_id;

            console.log(`Mensagem enviada para ${clientId}, ID da mensagem: ${sentMessage.message_id}`);

            // Salva os dados específicos para cada cliente
            await salvarMessageKey(messageKey, clientId, sentMessage.message_id, botName);

        } catch (error) {
            console.error(`Erro ao enviar mensagem para ${clientId}:`, error.message);
        }
    }

    console.log(`Chave da mensagem armazenada: ${messageKey} para todos os clientes.`);
    return messageKeys;
}

async function salvarMessageKey(messageKey, clientId, messageId, botName) {
    try {
		
		 if (!botName) {
            console.error("Erro: O nome do bot não está definido.");
            return; // Saia da função se o nome do bot estiver ausente
        }
        const dataToSend = {
            action: 'salvarMessageKey',
            messageKey, // Chave da mensagem
            clienteId: clientId, // ID do cliente
            sentMessage: {
                message_id: messageId // ID único da mensagem
            },
			 nome_bot: botName
        };

        console.log("Dados enviados para o Google Sheets:", dataToSend);

        // Faz a requisição POST para o Google Sheets
        const response = await axios.post(GOOGLE_SHEETS_URL, dataToSend);

        // Log da resposta para entender melhor o formato retornado
        console.log('Resposta completa do Google Sheets:', response.data);
if (response.data.success) {
    console.log(`Chave de mensagem e status 'Enviado' salvos com sucesso no Google Sheets para o cliente ${clientId}.`);
} else {
    console.error(`Erro ao salvar a chave de mensagem no Google Sheets para o cliente ${clientId}: ${response.data.error || "Resposta inválida."}`);
}

    } catch (error) {
        console.error("Erro ao salvar a chave de mensagem:", error.message);
    }
}


// Função para buscar a relação messageKey ↔ clienteId ↔ messageId no Google Sheets
async function buscarMensagemGoogleSheets(messageKey) {
    try {
        console.log("Iniciando a busca da MessageKey:", messageKey);

        // Verifique se a chave foi fornecida
        if (!messageKey || !botName) {
            console.error("Erro: messageKey está ausente.");
            return null;
        }

        // Monta o payload da requisição
        const payload = {
            action: 'buscarMessageKey',
            messageKey: messageKey,
            nome_bot: botName, // Incluindo o nome do bot
        };

        console.log("Enviando requisição ao Google Sheets:", payload);

        // Envie a requisição ao Apps Script
        const response = await axios.post(GOOGLE_SHEETS_URL, payload);

        if (response.data && response.data.success) {
            // Aqui estamos assumindo que response.data.messageIds é um objeto no formato clienteId: messageId
            console.log("Busca bem-sucedida! Dados recebidos:", response.data.messageIds);
            return response.data.messageIds; // Retorna o objeto com clienteId como chave e messageId como valor
        } else {
            console.error("Erro ao buscar dados do Google Sheets:", response.data.error || response.data);
            return null;
        }
    } catch (error) {
        console.error("Erro ao consultar Google Sheets:", error.message);
        return null;
    }
}

// Função para deletar as mensagens para os clientes
async function deletarMensagem(bot, messageKey, botName) {
    let mensagemDeletada = false;

    try {
        // Buscar relação messageKey ↔ clienteId ↔ messageId do Google Sheets
        const messageKeys = await buscarMensagemGoogleSheets(messageKey, botName);

        if (!messageKeys || messageKeys.length === 0) {
            console.error("Nenhuma mensagem encontrada para exclusão no Google Sheets.");
            return mensagemDeletada;
        }

        // Processar exclusão
        const dadosParaPlanilha = [];
        for (const { clienteId, messageId } of messageKeys) {
            if (!messageId) {
                console.error(`MessageId não encontrado para cliente ${clienteId}.`);
                continue;
            }

            // Extraímos o ID numérico da mensagem
            const messageIdNumeric = messageId.split(' ')[0]; // Assume-se que o ID é o primeiro valor

            // Excluir mensagem diretamente no Telegram
            try {
                // Aqui estamos assumindo que `clienteId` é o ID do usuário que enviou a mensagem
                // e deve ser passado diretamente para o método deleteMessage
                await bot.telegram.deleteMessage(clienteId, messageIdNumeric);
                console.log(`Mensagem ${messageIdNumeric} excluída para cliente ${clienteId}`);
                dadosParaPlanilha.push({
                    action: 'deletarMessageKey',
                    messageKey: messageKey,
                    clienteId: clienteId,
                    messageId: messageIdNumeric,
					nome_bot: botName, // Incluindo o nome do bot no payload
                });
            } catch (error) {
                console.error(`Erro ao excluir mensagem ${messageIdNumeric} para cliente ${clienteId}:`, error.message);
            }
        }

        // Atualizar Google Sheets para refletir exclusão
        if (dadosParaPlanilha.length > 0) {
            try {
                const response = await axios.post(GOOGLE_SHEETS_URL, {
                    action: 'deletarMessageKey',
                    clienteId: messageKeys.map(m => m.clienteId),
                    messageKey: messageKey,
					nome_bot: botName, // Incluindo o nome do bot
                });
                console.log("Resposta do Google Sheets:", response.data);
                mensagemDeletada = true;
            } catch (error) {
                console.error("Erro ao enviar dados para o Google Sheets:", error.message);
            }
        }
    } catch (error) {
        console.error("Erro geral ao tentar deletar mensagens:", error.message);
    }

    return mensagemDeletada;
}






// Listener de mensagens
bot.on('message', async (ctx) => {
    const userId = ctx.from.id;

			if (userId.toString() === adminId) {
			if (ctx.message.text && ctx.message.text.startsWith('/deletar_')) {
            let messageKey = ctx.message.text.slice(9).trim();

            if (!messageKeys[messageKey]) {
                return ctx.reply(`Nenhuma mensagem encontrada com a chave ${messageKey}.`);
            }
			let mensagemDeletada = await deletarMensagem(bot, messageKey, messageKeys);
            ctx.reply(mensagemDeletada ? `Mensagens com a chave ${messageKey} deletadas.` : `Nenhuma mensagem para deletar com a chave ${messageKey}.`);

					
			} else {
            // Chama a função para processar a mensagem
			const { mensagem, contentToSend, inlineButtons, messageKey } = await processarMensagem(ctx);
		
			// Chama a função para enviar a mensagem
			const clienteIds = await buscarClientes();  // Agora obtém os IDs de todos os clientes
            await enviarMensagem(bot, clienteIds, mensagem, inlineButtons, contentToSend, messageKey, messageKeys);
		    ctx.reply(`Mensagem enviada para todos os usuários.\n\nChave para apagar mensagem: \n/deletar_${messageKey}`);

			}
			} else {
			//ctx.reply("Você não tem permissão para enviar mensagens ao bot.");
    }
});


// Função para gerar uma chave única
function generateUniqueKey() {
 const now = new Date();

    // Obter a data e hora no formato DDMMAAHHMMSS
    const day = String(now.getDate()).padStart(2, '0'); // Adiciona 0 se o dia for menor que 10
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Meses começam de 0
    const year = String(now.getFullYear()).slice(-2); // Apenas os dois últimos dígitos do ano
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');

    // Gerar a chave única sem número aleatório
    return `msg_${day}${month}${year}${hour}${minute}${second}`;
	
}



// Ação do botão inline para gerar pagamento
bot.action(/gerar_pagamento:(\d+)/, async (ctx) => {
    const valor = parseInt(ctx.match[1]); // Captura o valor passado no callback_data (valorCentavos)
    
    // Chama a função gerarPagamento com o valor
    await gerarPagamento(ctx, valor);
});

































// Função para iniciar o fluxo de conteúdo
async function iniciarFluxoDeConteudo(ctx) {
	
    // Obtendo o primeiro nome do usuário
    const primeiroNome = ctx.from.first_name;

    // Enviando mensagem inicial
    const mensagemInicialMessage = await ctx.reply(`Oiie ${primeiroNome} ❤️`);
	mensagemInicialMessageIds[`${ctx.chat.id}-mensagemInicial`] = mensagemInicialMessage.message_id;
    // MENSAGEM 1 - PACOTE LUXURIA
    const videoUrlLuxuria = 'https://video.gumlet.io/66180b4d8ec2efeb9164568c/683d11dfc1c930f55679bdbf/download.mp4';
   const captionLuxuria = `Você finalmente encontrou meu chat secreto gatinhooo 😈`;

   // const inlineKeyboardLuxuria = Markup.inlineKeyboard([
  //      [Markup.button.callback('Comprar por R$ 57', 'Luxuria')]
   // ]);
 
  // Delay de 5 segundos antes de enviar MENSAGEM 1
setTimeout(async () => {
  try {
    const luxuriaMessage = await ctx.replyWithVideo(videoUrlLuxuria, {
      caption: captionLuxuria,
      parse_mode: 'MarkdownV2',
    });

    // Armazena o ID da mensagem
    luxuriaMessageIds[`${ctx.chat.id}-luxuria`] = luxuriaMessage.message_id;

    // Delay de 2 minutos para apagar a mensagem
    setTimeout(async () => {
      try {
        await ctx.deleteMessage(luxuriaMessage.message_id);
      } catch (err) {
        console.error('Erro ao deletar a mensagem:', err);
      }
    }, 60000); // 60 segundos

  } catch (err) {
    console.error('Erro ao enviar vídeo:', err);
  }
}, 5000); // 5 segundos


    // MENSAGEM 2 - PACOTE FANTASIA
    const videoUrlFantasia = 'https://video.gumlet.io/66180b4d8ec2efeb9164568c/683d1138c2302966c82874dc/download.mp4';
    const captionFantasia = `Tô esperando por você 💖
Esses são os meus pacotes  🔞👇🏻`;
const inlineKeyboardFeitiço = Markup.inlineKeyboard([
        [Markup.button.callback('VIP 1 MÊS • R$ 29,90', 'Feitiço')] ]);
	
	const inlineKeyboardFantasia = Markup.inlineKeyboard([
        [Markup.button.callback('Pack Fantasia • R$ 49,90', 'Fantasia')]   ]);
	
    const inlineKeyboardLuxuria = Markup.inlineKeyboard([
       [Markup.button.callback('Pack Luxuria • R$ 69,90', 'Luxuria')]   ]);
  
    const inlineKeyboardPezinho = Markup.inlineKeyboard([
       [Markup.button.callback('Pack do Pé • R$ 147,00', 'Pezinho')]

       

	       
    ]);

    // Delay de 10 segundos antes de enviar MENSAGEM 2 (total de 15 segundos após a primeira)
    setTimeout(async () => {
        const fantasiaMessage = await ctx.replyWithVideo(videoUrlFantasia, {
  caption: captionFantasia,
  parse_mode: 'MarkdownV2',
  reply_markup: {
    inline_keyboard: [
	    ...inlineKeyboardFeitiço.reply_markup.inline_keyboard,
	    ...inlineKeyboardFantasia.reply_markup.inline_keyboard,
            ...inlineKeyboardLuxuria.reply_markup.inline_keyboard,
            ...inlineKeyboardPezinho.reply_markup.inline_keyboard,
    ]
  }
});
    fantasiaMessageIds[`${ctx.chat.id}-fantasia`] = fantasiaMessage.message_id;
	}, 40000); // 15 segundos (5s + 10s)
		
    // MENSAGEM 3 - PACOTE FEITIÇO
 //   const videoUrlFeitiço = 'https://video.gumlet.io/66180b4d8ec2efeb9164568c/671bc33038a902e47566e3d3/download.mp4';
//    const captionFeitiço = `***VIP 1 MÊS*** \n` + 
	//					   `13 Vídeos e 10 Fotos \n\n` +
	//					   `Nesse pack você vai encontrar meus melhores videozinhos gozando muito e gemendo gostoso \n\n` +
 //                          `Tem vídeo meladinha, me masturbando, com plugzinho no meu cu, e dos melhores jeitos pra você\\!`;

  //  const inlineKeyboardFeitiço = Markup.inlineKeyboard([
   //     [Markup.button.callback('Comprar por R$ 19,90', 'Feitiço')]
   // ]);

    // Delay de 15 segundos antes de enviar MENSAGEM 3 (total de 30 segundos após a primeira)
   // setTimeout(async () => {
 //       const feitiçoMessage = await ctx.replyWithVideo(videoUrlFeitiço, { caption: captionFeitiço, parse_mode: 'MarkdownV2', reply_markup: inlineKeyboardFeitiço.reply_markup });
  //  feitiçoMessageIds[`${ctx.chat.id}-feitiço`] = feitiçoMessage.message_id;
//	}, 9000); // 30 segundos (5s + 10s + 15s)
	
	
 // Mensagem final "To te esperando..." após MENSAGEM 3
    setTimeout(async () => {
        const toEsperandoMessage = await ctx.reply("To te esperando...");
    toEsperandoMessageIds[`${ctx.chat.id}-toEsperando`] = toEsperandoMessage.message_id;
   }, 50000); // 35 segundos (5s + 10s + 15s + 5s)
   
	setTimeout(() => consultarUsuario(ctx), 12 * 60 * 60 * 1000); // 12 horas em milissegundos
}

// Comando para escolher forma de pagamento AQUI TA OK **************************************************
bot.action(/^(Pezinho|Luxuria|Fantasia|Feitiço)$/, async (ctx) => {
	// Chama diretamente a função limparMensagens
	await limparMensagens(ctx, '2');
   
			
	const pacoteEscolhido = ctx.match[0];
	
    // Envia a mensagem "Escolha a forma de pagamento:"
    const paymentChoiceMessage = await ctx.reply("Escolha a forma de pagamento:", 
        Markup.inlineKeyboard([ 
            [Markup.button.callback('PIX', `${pacoteEscolhido}-pix`), Markup.button.callback('Cartão de Crédito', `${pacoteEscolhido}-cartao`)]
        ])
    );

    // Armazena o ID da mensagem para deletar depois, usando `chat.id` como chave
    paymentChoiceMessageIds[`${ctx.chat.id}-paymentChoice`] = paymentChoiceMessage.message_id;
	
	
				
});

// Comando para gerar pagamento via Cartão de Crédito
bot.action(/(Pezinho|Luxuria|Fantasia|Feitiço)-cartao/, async (ctx) => {
    const pacoteEscolhido = ctx.match[0].split('-')[0];
     // Envia a mensagem "Gerando Pagamento..." e armazena o ID da mensagem
    const generatingMessage = await ctx.reply(
        'Gerando Pagamento\\.\\.\\.',
        { parse_mode: 'MarkdownV2' }
    );

    // Armazena o ID da mensagem de "Gerando Pagamento..." usando `chat.id` como chave
    generatingMessageIds[`${ctx.chat.id}-generating`] = generatingMessage.message_id;

    // Delay de 5 segundos
    await new Promise(resolve => setTimeout(resolve, 3000));

    let checkoutLink = '';
    switch (pacoteEscolhido) {
	case 'Pezinho':
            checkoutLink = 'https://pay.cakto.com.br/4VrpxFw';
            break;	    
        case 'Luxuria':
            checkoutLink = 'https://pay.cakto.com.br/4VrpxFw';
            break;
        case 'Fantasia':
            checkoutLink = 'https://pay.cakto.com.br/6j8hePu';
            break;
        case 'Feitiço':
            checkoutLink = 'https://pay.cakto.com.br/5BxgnJ8';
            break;
    }
    
	// Envia a mensagem "Clique no botão abaixo para ser redirecionado para a página de pagamentos."
    const generatingCheckoutMessage = await ctx.reply("Clique no botão abaixo para ser redirecionado para a página de pagamentos.", 
        Markup.inlineKeyboard([
            [Markup.button.url('Checkout', checkoutLink)]
        ])
    );

    // Armazena o ID da mensagem de checkout usando `chat.id` como chave
    generatingCheckoutMessageIds[`${ctx.chat.id}-generatingCheckout`] = generatingCheckoutMessage.message_id;
	
});

// Comando para gerar pagamento via PIX
bot.action(/(Pezinho|Luxuria|Fantasia|Feitiço)-pix/, async (ctx) => {
    const pacoteEscolhido = ctx.match[0].split('-')[0];
    const valor = precosPacotes[pacoteEscolhido];
    await gerarPagamento(ctx, valor, pacoteEscolhido);
});

// Função genérica para gerar pagamento
async function gerarPagamento(ctx, valor, descricao) {
	// Chama diretamente a função limparMensagens
	await limparMensagens(ctx, '1');
			
	try {
        const response = await axios.post(`${API_BASE_URL}/pix/cashIn`, { 
            value: valor, 
            webhook_url: GOOGLE_SHEETS_URL, 
        }, {
            headers: {
                'Authorization': `Bearer ${PUSHIN_PAY_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
		
            if (response.data && response.data.qr_code) {
            const qrCode = response.data.qr_code; 
            const transactionId = response.data.id; 
			
			// Envia a mensagem "Gerando Pagamento..." e armazena o ID da mensagem
			const generatingPaymentMessage = await ctx.reply(
			'Gerando Pagamento\\.\\.\\.',
			{ parse_mode: 'MarkdownV2' }
			);
			// ARMAZENA O ID DA MENSAGEM PRA APAGAR DEPOIS
			generatingPaymentMessageIds[`${ctx.chat.id}-generatingPayment`] = generatingPaymentMessage.message_id;
			
	        await new Promise(resolve => setTimeout(resolve, 3000)); // Delay de 3 segundos
			
			// Quando necessário, apague a mensagem "Gerando Pagamento..."
			if (generatingPaymentMessageIds[`${ctx.chat.id}-generatingPayment`]) {
			await ctx.deleteMessage(generatingPaymentMessageIds[`${ctx.chat.id}-generatingPayment`]);
			delete generatingPaymentMessageIds[`${ctx.chat.id}-generatingPayment`]; // Remove o ID da mensagem após a exclusão
			}
			
			// Calcular o horário de expiração (30 minutos)
            const expirationDate = new Date();
            expirationDate.setMinutes(expirationDate.getMinutes() + 30);
            const expirationTime = expirationDate.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
			
			// Envia a mensagem "Pagamento Gerado com Sucesso!" e armazena o ID da mensagem
			const successPaymentMessage = await ctx.reply(
			`✅ ***Pagamento Gerado com Sucesso\\!*** \n` +
			`válido até às ***${expirationTime}*** ⏰ \n\n` +
			`ℹ️ Para efetuar o pagamento, utilize a opção ***"Pagar" \\-\\> "PIX Copia e Cola"*** no aplicativo do seu banco\\. \n\n` +
			`Agora, é só realizar o pagamento e aguardar a aprovação\\. Assim que for aprovado, você receberá o acesso imediatamente\\.\n\n` +
			`***Copie o código da chave PIX abaixo:*** 👇🏻`,
			{ parse_mode: 'MarkdownV2' }
);
		   // Aguarda 3 segundos antes de enviar o QR Code
			await new Promise(resolve => setTimeout(resolve, 2000));
			
            // Envia a mensagem com o código QR e armazena o ID da mensagem
			const qrCodeMessage = await ctx.reply(
			`\`\`\`${qrCode}\`\`\``, 
			{ parse_mode: 'MarkdownV2' }
);

			// Armazena o ID da mensagem para deletar depois, usando `transactionId` como chave
			successPaymentMessageIds[`${ctx.chat.id}-successPayment`] = successPaymentMessage.message_id;
			qrCodeMessageIds[`${ctx.chat.id}-qrcode`] = qrCodeMessage.message_id;
			
			const mensagemAdmin = `🔔 ***PIX Gerado\\!*** \n` +
                      `Valor: R\\$ ${(valor / 100).toFixed(2).replace('.', ',')}`; // Escapando o ponto

			await bot.telegram.sendMessage(adminId, mensagemAdmin, {
				parse_mode: 'MarkdownV2'
			});

            const dadosParaGoogleSheets = {
                data_hora: new Date().toISOString(),
                id_chat_cliente: ctx.chat.id,
                nome_usuario: ctx.from.username || ctx.from.first_name,
                evento: ctx.from.first_name,
                id_transacao: transactionId,
                pacote: descricao, // Adicione o pacote correspondente
                valor: (valor / 100), 
                status: 'PIX Gerado', 
                nome_bot: botName 
            };
            await enviarDadosParaGoogleSheets(dadosParaGoogleSheets);
			
			// Delay de 1 minuto (60 segundos)
			await new Promise(resolve => setTimeout(resolve, 2000));
			
			
			// Envia a mensagem "Já pagou?" com o botão inline "✅ Já paguei ✅"
			const jaPagouMessage = await ctx.reply(
						"Já pagou\\?",
				{
					parse_mode: 'MarkdownV2',
					reply_markup: {
					inline_keyboard: [
                [
                    { text: '✅ Já paguei', callback_data: `verificar_pagamento:${transactionId}` }
                ]
            ]
        }
    }
);
			// Armazenar o ID da mensagem "Já pagou?" para deletar depois
			jaPagouMessageIds[`${ctx.chat.id}-jaPagou`] = jaPagouMessage.message_id;
		
		   
			// Agendar a verificação para 10 minutos
            setTimeout(() => agendarLembreteDePagamento(ctx, transactionId, descricao), 600000); // 10 minutos
			
		
        } else {
            console.error('Erro: QR Code não encontrado:', response.data);
            await ctx.reply('Ocorreu um erro ao gerar o pagamento: QR Code não encontrado.');
        }
    } catch (error) {
        console.error('Erro ao gerar pagamento:', error.response ? error.response.data : error.message);
        await ctx.reply('Ocorreu um erro ao gerar o pagamento. Tente novamente mais tarde.');
    }
		
}

// Configurando os manipuladores de callback
bot.action(/verificar_pagamento:(.+)/, (ctx) => {
    const transactionId = ctx.match[1]; 
    verificarPagamento(ctx, transactionId);
});

// Função para verificar o status do pagamento
async function verificarPagamento(ctx, transactionId) {
	
		// Quando necessário, apague a mensagem "Ja pagou?"
			if (jaPagouMessageIds[`${ctx.chat.id}-jaPagou`]) {
			await ctx.deleteMessage(jaPagouMessageIds[`${ctx.chat.id}-jaPagou`]);
			delete jaPagouMessageIds[`${ctx.chat.id}-jaPagou`]; // Remove o ID da mensagem após a exclusão
			}
			
			if (verificarNovamenteMessageIds[`${ctx.chat.id}-verificarNovamente`]) {
			await ctx.deleteMessage(verificarNovamenteMessageIds[`${ctx.chat.id}-verificarNovamente`]);
			delete verificarNovamenteMessageIds[`${ctx.chat.id}-verificarNovamente`]; // Remove o ID da mensagem após a exclusão
			}
	
		// Envia a mensagem "Verificando Pagamento..." e armazena o ID da mensagem
			const verificationMessage = await ctx.reply(
			'Verificando Pagamento\\.\\.\\.',
			{ parse_mode: 'MarkdownV2' }
);
		// Armazenar o ID da mensagem de verificação para deletar depois
			verificationMessageIds[`${ctx.chat.id}-verification`] = verificationMessage.message_id;
		    
    const url = `${API_BASE_URL}/transactions/${transactionId}`;
    
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${PUSHIN_PAY_API_KEY}`
            }
        });

        
        if (!response.data) {
            throw new Error('Sem dados retornados da API.');
        }

        const { status, value } = response.data;

        if (status === 'paid') {
            // O valor pago deve estar em centavos já
            const valorPagoNumerico = parseInt(value); // Convertendo o valor para inteiro (centavos)

            // Obter o pacote correspondente ao valor pago
            const pacoteEntregue = obterPacotePorValor(valorPagoNumerico); // Valor em centavos

            if (pacoteEntregue) {
				
				const mensagemAdmin = `🔔 ***Pagamento Aprovado\\! *** \n` +
                      `Valor: R\\$ ${(valorPagoNumerico / 100).toFixed(2).replace('.', ',')}`;

				await bot.telegram.sendMessage(adminId, mensagemAdmin, {
					parse_mode: 'MarkdownV2'
				});
				
				
				// Chama diretamente a função limparMensagens
				await limparMensagens(ctx, '3');
				
							
                await ctx.reply(`✅ ***Pagamento Aprovado\\! *** \n\n` +
                                `Seja bem\\-vindo\\(a\\) ${ctx.from.first_name}\\! \n` +
								`Você já pode acessar o conteúdo do ${pacoteEntregue.nome}\\!`, {
                    parse_mode: 'MarkdownV2',
					reply_markup: {
					inline_keyboard: [
							[{ text: 'Acessar Conteúdo', url: pacoteEntregue.link }]
							]
							}
							});
				
				await enviarUpsell(ctx, pacoteEntregue.nome);
            } else {
                await ctx.reply('O valor pago não corresponde a nenhum pacote disponível.');
            }

            const dadosParaGoogleSheets = {
                data_hora: new Date().toISOString(),
                id_chat_cliente: ctx.chat.id,
                nome_usuario: ctx.from.username || ctx.from.first_name,
                evento: ctx.from.first_name,
                id_transacao: transactionId,
				pacote: pacoteEntregue.nome, // Adicione o pacote correspondente
                valor: (valorPagoNumerico / 100), // Mantendo em centavos
                status: 'Aprovado',
                nome_bot: botName 
            };
            await enviarDadosParaGoogleSheets(dadosParaGoogleSheets);
			} else {
			
			// Aguarda 6 segundos antes de enviar a mensagem
			await new Promise(resolve => setTimeout(resolve, 6000));
				
			// Quando necessário, apague a mensagem "Verificando Pagamento..."
			if (verificationMessageIds[`${ctx.chat.id}-verification`]) {
			await ctx.deleteMessage(verificationMessageIds[`${ctx.chat.id}-verification`]);
			delete verificationMessageIds[`${ctx.chat.id}-verification`]; // Remove o ID da mensagem após a exclusão
			}
			
			// Envia a mensagem com o botão inline "⏳ VERIFICAR NOVAMENTE ⏳" e armazena o ID da mensagem
			const verificarNovamenteMessage = await ctx.reply(
				'Ainda não identifiquei esse pagamento, aguarde e verifique novamente...', 
			{
			reply_markup: {
            inline_keyboard: [
                [
                    { text: '⏳ VERIFICAR NOVAMENTE ⏳', callback_data: `verificar_pagamento:${transactionId}` }
                ]
            ]
        }
    }

);
			// Armazena o ID da mensagem para deletar depois, usando `transactionId` como chave
			verificarNovamenteMessageIds[`${ctx.chat.id}-verificarNovamente`] = verificarNovamenteMessage.message_id;
		}

    } catch (error) {
        console.error('Erro ao verificar pagamento:', error.response ? error.response.data : error.message);
        await ctx.reply('Ocorreu um erro ao verificar o pagamento. Tente novamente mais tarde.');
    }
	}

// Função de lembrete de pagamento
async function agendarLembreteDePagamento(ctx, transactionId, descricao) {
    // Verifique o status do pagamento antes de enviar lembrete
    const response = await axios.get(`${API_BASE_URL}/transactions/${transactionId}`, {
        headers: { Authorization: `Bearer ${PUSHIN_PAY_API_KEY}` }
    });

    const { status, value } = response.data; // Inclui o valor da transação
    const valorOriginal = precosPacotes[descricao]; // Obtém o valor original com base no pacote

    // Verifica se o status não é "paid" e se o valor está dentro da margem de 50 centavos
    if (status !== 'paid' && Math.abs(value - valorOriginal) <= 50 && qrCodeMessageIds[`${ctx.chat.id}-qrcode`]) {
        // Primeira mensagem com `MarkdownV2`
        const primeiroNome = ctx.from.first_name.replace(/([_*[\]()~>#+\-=|{}.!])/g, '\\$1');
		
        const vique1Message = await ctx.reply(
		`Oiie ${primeiroNome}, eu vi que você gerou um PIX, to esperando o pagamento pra poder enviar o seu acesso VIP\\.\\.\\. 🥵`, {
            parse_mode: 'MarkdownV2'
        });
		// Delay de 5 segundos
		await new Promise(resolve => setTimeout(resolve, 10000));
        // Segunda mensagem com botão inline usando `MarkdownV2`
        const vique2Message = await ctx.reply(
		`Você está a um passo de acessar meus conteúdos exclusivos\\! \n\n` +
		`Vi aqui agora e lembrei de você ${primeiroNome},\n` +
		`Liberei \\+1 vaga com um desconto especial pra você\\. \n\n Você vem\\?\\?`, {
            parse_mode: 'MarkdownV2',
            reply_markup: {
                inline_keyboard: [
                    [{ text: "🔒 Desbloquear conteúdo", callback_data: `oferecerDesconto:${descricao}` }]
                ]
            }
        });
		
// Armazena o ID da mensagem 
		vique1MessageIds[`${ctx.chat.id}-vique1`] = vique1Message.message_id;
		vique2MessageIds[`${ctx.chat.id}-vique2`] = vique2Message.message_id;
		
    }
	 
}

// Callback para oferecer desconto
bot.action(/oferecerDesconto:(.+)/, async (ctx) => {
    const descricao = ctx.match[1];
    await oferecerDesconto(ctx, descricao);
});

// Função para oferecer desconto com base no pacote escolhido
async function oferecerDesconto(ctx, descricao) {
	// Chama diretamente a função limparMensagens
	await limparMensagens(ctx, '4');
	const primeiroNome = ctx.from.first_name.replace(/([_*[\]()~>#+\-=|{}.!])/g, '\\$1');
	const vique3Message = await ctx.reply(
		`Você está a um passo de acessar meus conteúdos exclusivos\\! \n\n` +
		`Vi aqui agora e lembrei de você ${primeiroNome},\n` +
		`Liberei \\+1 vaga com um desconto especial pra você\\. \n\n Você vem\\?\\?`, {
            parse_mode: 'MarkdownV2'
        });
	    vique3MessageIds[`${ctx.chat.id}-vique3`] = vique3Message.message_id; 
		
	// Obtém o valor original com base no pacote
    const valorOriginal = precosPacotes[descricao];
    const valorComDesconto = Math.round(valorOriginal * 0.7); // 30% de desconto
		
	// Delay de 5 segundos
    await new Promise(resolve => setTimeout(resolve, 10000));	
	
	const desc1Message = await ctx.reply(
        `Olha amor se você quiser eu posso te dar um desconto pro Pacote ${descricao.replace(/([_*[\]()~>#+\-=|{}.!])/g, '\\$1')}\\.\\.\\.\n\n`,
        { parse_mode: 'MarkdownV2' }
    );
		// Delay de 5 segundos
		await new Promise(resolve => setTimeout(resolve, 10000));
    const desc2Message = await ctx.reply(
	   `Ai em vez de você pagar R\\$ ${(precosPacotes[descricao] / 100).toFixed(2).replace(/([_*[\]()~>#+\-=|{}.!])/g, '\\$1')} \n` + 
	   `eu faço pra você agora por R\\$ ${(valorComDesconto / 100).toFixed(2).replace(/([_*[\]()~>#+\-=|{}.!])/g, '\\$1')}\\.\\.\\. \n\n` + 
	   `Pode ser amor\\??`, 
			{
        parse_mode: 'MarkdownV2',
        reply_markup: {
            inline_keyboard: [
                [{ text: "Aceitar desconto", callback_data: `gerarPagamentoComDesconto:${descricao}-${valorComDesconto}` }]
            ]
        }
    });
	// Armazena o ID da mensagem de "Olha amor.. " usando `chat.id` como chave
    desc1MessageIds[`${ctx.chat.id}-desc1`] = desc1Message.message_id;
	// Armazena o ID da mensagem de "um desconto de... " usando `chat.id` como chave
    desc2MessageIds[`${ctx.chat.id}-desc2`] = desc2Message.message_id;
	
}

// Função para gerar pagamento com desconto usando callback com pacote e valor
bot.action(/gerarPagamentoComDesconto:(.+)-(\d+)/, async (ctx) => {
	await limparMensagens(ctx, '4');
	const descricao = ctx.match[1];
    const valorComDesconto = parseInt(ctx.match[2], 10);
	const desc3Message = await ctx.reply(
		`um desconto pro Pacote ${descricao.replace(/([_*[\]()~>#+\-=|{}.!])/g, '\\$1')}\\.\n\n` +
        `Ai em vez de você pagar R\\$ ${(precosPacotes[descricao] / 100).toFixed(2).replace(/([_*[\]()~>#+\-=|{}.!])/g, '\\$1')} \n ` + 
	    `eu faço pra você agora por R\\$ ${(valorComDesconto / 100).toFixed(2).replace(/([_*[\]()~>#+\-=|{}.!])/g, '\\$1')}\\.\\.\\. \n\n` + 
	    `Pode ser amor\\??`, 
			{
        parse_mode: 'MarkdownV2'
        });
	desc3MessageIds[`${ctx.chat.id}-desc3`] = desc3Message.message_id;
	
	// Delay de 5 segundos
    await new Promise(resolve => setTimeout(resolve, 2000));
	
	 const okAmorMessage = await ctx.reply(
		`Ok amor, vou te mandar a chave pix\\.\\.\\.`, {
            parse_mode: 'MarkdownV2'
        });
	okAmorMessageIds[`${ctx.chat.id}-okAmor`] = okAmorMessage.message_id;
	
    // Delay de 5 segundos
    await new Promise(resolve => setTimeout(resolve, 3000));
	await gerarPagamento(ctx, valorComDesconto, descricao);
	
	    
	 
	
});

// Função para obter a descrição do pacote com base na chave
function obterDescricaoPacote(pacote) {
    const descricoes = {
        Feitiço: 'FEITIÇO',
        Fantasia: 'FANTASIA',
        Luxuria: 'LUXURIA',
	Pezinho: 'PEZINHO'
    };
    return descricoes[pacote] || 'Pacote Desconhecido';
}

// Função para determinar o pacote com base no valor pago
function obterPacotePorValor(valorPago) {
    // O valor já deve estar em centavos
    const valorEmCentavos = valorPago; 

    // Definindo a margem de R$ 1,00 em centavos
    const margem = 100;

    // Verificando qual pacote corresponde ao valor pago
    if (
        (valorEmCentavos >= precosPacotes.Feitiço - margem && valorEmCentavos <= precosPacotes.Feitiço + margem) ||
        (valorEmCentavos >= (precosPacotes.Feitiço / 2) - margem && valorEmCentavos <= (precosPacotes.Feitiço / 2) + margem) ||
        (valorEmCentavos >= Math.round(precosPacotes.Feitiço * 0.7) - margem && valorEmCentavos <= Math.round(precosPacotes.Feitiço * 0.7) + margem) // Desconto de 30%
    ) {
        return { nome: 'VIP 1 MÊS', link: 'https://photos.app.goo.gl/CRnAp21g1iZYK4WT7' };
    } else if (
        (valorEmCentavos >= precosPacotes.Fantasia - margem && valorEmCentavos <= precosPacotes.Fantasia + margem) ||
        (valorEmCentavos >= (precosPacotes.Fantasia / 2) - margem && valorEmCentavos <= (precosPacotes.Fantasia / 2) + margem) ||
        (valorEmCentavos >= Math.round(precosPacotes.Fantasia * 0.7) - margem && valorEmCentavos <= Math.round(precosPacotes.Fantasia * 0.7) + margem) // Desconto de 30%
    ) {
        return { nome: 'Pacote FANTASIA 💋', link: 'https://photos.app.goo.gl/iUrVW2yi8WjffgXi8' };
    } else if (
        (valorEmCentavos >= precosPacotes.Luxuria - margem && valorEmCentavos <= precosPacotes.Luxuria + margem) ||
        (valorEmCentavos >= (precosPacotes.Luxuria / 2) - margem && valorEmCentavos <= (precosPacotes.Luxuria / 2) + margem) ||
        (valorEmCentavos >= Math.round(precosPacotes.Luxuria * 0.7) - margem && valorEmCentavos <= Math.round(precosPacotes.Luxuria * 0.7) + margem) // Desconto de 30%
    ) {
        return { nome: 'Pacote LUXURIA 👑', link: 'https://photos.app.goo.gl/bFHBMtBDqnLQnCMg6' };
   } else if (
        (valorEmCentavos >= precosPacotes.Pezinho - margem && valorEmCentavos <= precosPacotes.Pezinho + margem) ||
        (valorEmCentavos >= (precosPacotes.Pezinho / 2) - margem && valorEmCentavos <= (precosPacotes.Pezinho / 2) + margem) ||
        (valorEmCentavos >= Math.round(precosPacotes.Pezinho * 0.7) - margem && valorEmCentavos <= Math.round(precosPacotes.Pezinho * 0.7) + margem) // Desconto de 30%
    ) {
        return { nome: 'Pack do Pézinho 👣', link: 'https://photos.app.goo.gl/pe2cKjY8AXins4Ux8' };
    } else {
        return null; // Nenhum pacote corresponde ao valor
    }
}

// Função para determinar o próximo pacote e o valor do upsell
function obterUpsell(pacoteAtual) {
    const pacotes = {
        'VIP 1 MÊS': { nome: 'Pacote FANTASIA 💋', preco: Math.round(precosPacotes['Fantasia'] / 2) },
        'Pacote FANTASIA 💋': { nome: 'Pacote LUXURIA 👑', preco: Math.round(precosPacotes['Luxuria'] / 2) },
        'Pacote LUXURIA 👑': { nome: 'Pack do Pézinho 👣', preco: Math.round(precosPacotes['Pezinho'] / 2) },
    };
    return pacotes[pacoteAtual] || null;
}

// Função para enviar a mensagem de Upsell
async function enviarUpsell(ctx, pacoteEntregue) {
		const upsell = obterUpsell(pacoteEntregue);
    
		if (upsell) {
        await new Promise(resolve => setTimeout(resolve, 180000)); // Espera 3 minutos
        
        // Envia a mensagem de upsell com o pacote e valor diretamente no callback_data
        const upsellMessage = await ctx.reply(
            `🎉 ***Oferta Especial\\!***\n` +
            `Você acaba de receber o ${pacoteEntregue.replace(/([_*[\]()~>#+\-=|{}.!])/g, '\\$1')}\\. \n` +
            `Aproveite a oferta exclusiva para o ${upsell.nome.replace(/([_*[\]()~>#+\-=|{}.!])/g, '\\$1')} por apenas R\\$ ${(upsell.preco / 100).toFixed(2).replace('.', '\\.')}\\!`,
            {
                parse_mode: 'MarkdownV2',
                reply_markup: {
                    inline_keyboard: [
                        [{ 
                            text: 'Comprar Agora', 
                            callback_data: `${upsell.nome}-${upsell.preco}` // Passa nome e valor juntos
                        }]
                    ]
                }
            }
        );
		// Armazena o ID da mensagem para deletar depois, usando `transactionId` como chave
			upsellMessageIds[`${ctx.chat.id}-upsell`] = upsellMessage.message_id;
    } else { }
}

// Comando para gerar pagamento via PIX no upsell
bot.action(/(Pack do Pézinho 👣|Pacote LUXURIA 👑|Pacote FANTASIA 💋|VIP 1 MÊS)-(\d+)/, async (ctx) => {
    const pacoteEscolhido = ctx.match[1]; // Pacote escolhido a partir do callback_data
    const valor = parseInt(ctx.match[2], 10); // Valor do upsell diretamente do callback_data

    if (valor) {
        // Gera o pagamento usando o valor e nome do pacote
        await gerarPagamento(ctx, valor, pacoteEscolhido);
    } else {
        await ctx.reply('Erro ao obter o valor. Tente novamente.');
    }
});

// Função para enviar dados para o Google Sheets
async function enviarDadosParaGoogleSheets(data) {
    try {
        await axios.post(GOOGLE_SHEETS_URL, data);
    } catch (error) {
        console.error('Erro ao enviar dados para o Google Sheets:', error.response ? error.response.data : error.message);
    }
}

// Função pra verificar se o usuario ja é cliente
async function consultarUsuario(ctx) {
    // Defina a URL do Google Sheets para consultar os dados
    try {
        const response = await axios.get(GOOGLE_SHEETS_URL);
        console.log("Dados recebidos do Google Sheets:", response.data); // Verifique a estrutura da resposta

        // Verifique se a propriedade 'values' existe e é um array
        if (response.data.values && Array.isArray(response.data.values)) {
            const data = response.data.values; // Supondo que você receba os dados em um array de arrays
            const userId = ctx.chat.id.toString(); // ID do chat do usuário como string
            let isClient = false;

            // Itera sobre os registros para verificar se o usuário é cliente
            for (const row of data.slice(1)) { // Ignora a primeira linha (cabeçalhos)
                console.log(`Comparando userId: ${userId} com ID Cliente: ${row[1]}`); // Log de comparação
                if (row[1].toString() === userId && (row[7] === 'PIX Gerado' || row[7] ==='')) { // Coluna B é o ID do chat e a coluna H é o status
                    isClient = true;
                    break;
                }
            }

            if (isClient) {
                console.log("Usuário encontrado. Enviando mensagem de boas-vindas."); // Log de sucesso
                await enviarMensagemDeBoasVindas(ctx);
            } else {
                console.log("Usuário não encontrado ou status não é 'PIX Gerado'."); // Log de erro
            }
        } else {
            console.error("Dados inesperados recebidos:", response.data);
        }
    } catch (error) {
        console.error("Erro ao consultar Google Sheets:", error);
        ctx.reply("Houve um erro ao processar sua solicitação."); // Mensagem de erro para o usuário
    }
}

// Enviar mensagem de boas vindas depois de 12 hrs
async function enviarMensagemDeBoasVindas(ctx) {
	await limparMensagens(ctx, '5');
    const mensagem = `Bem-vindo ❤\n` +
        `Nos meus conteúdos eu passo meu Whats pra gente conversar e até trocar nudes de vez em quando (se você quiser)\n\n` +
        `Você vai ver todos meus vídeos transando, fazendo garganta profunda, me masturbando até gozar bem gostoso, além dos vídeos socando bem forte no meu cuzinho, TUDO o que você imaginar \n\n` +
        `Você vem?? 😈👇🏻`;

    // Envia a mensagem de boas-vindas
    const bemVindoMessage = await ctx.reply(mensagem, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'EU QUERO', callback_data: 'iniciar_bot' }]
            ]
        }
    });
// Armazena o ID da mensagem para deletar depois, usando `chat.id` como chave
    bemVindoMessageIds[`${ctx.chat.id}-bemVindo`] = bemVindoMessage.message_id;
	
    setTimeout(() => consultarUsuario2(ctx), 6 * 60 * 60 * 1000); // 6 horas em milissegundos
}

// Tratar o callback do botão "EU QUERO"
bot.action('iniciar_bot', async (ctx) => {
    await limparMensagens(ctx, '5');
	const bemVindo2Message = await ctx.reply(
		`Bem\\-vindo ❤\n` +
        `Nos meus conteúdos eu passo meu Whats pra gente conversar e até trocar nudes de vez em quando \\(se você quiser\\)\n\n` +
        `Você vai ver todos meus vídeos transando, fazendo garganta profunda, me masturbando até gozar bem gostoso, além dos vídeos socando bem forte no meu cuzinho, TUDO o que você imaginar\n\n` +
        `Você vem\\?\\? 😈👇🏻?`, 
			{
        parse_mode: 'MarkdownV2'
        });
		bemVindo2MessageIds[`${ctx.chat.id}-bemVindo2`] = bemVindo2Message.message_id;
	
    // Chamar o fluxo de conteúdo aqui
    await iniciarFluxoDeConteudo(ctx);
});

// Função pra verificar se o usuario ja é cliente
async function consultarUsuario2(ctx) {
    // Defina a URL do Google Sheets para consultar os dados
    try {
        const response = await axios.get(GOOGLE_SHEETS_URL);
        console.log("Dados recebidos do Google Sheets:", response.data); // Verifique a estrutura da resposta

        // Verifique se a propriedade 'values' existe e é um array
        if (response.data.values && Array.isArray(response.data.values)) {
            const data = response.data.values; // Supondo que você receba os dados em um array de arrays
            const userId = ctx.chat.id.toString(); // ID do chat do usuário como string
            let isClient = false;

            // Itera sobre os registros para verificar se o usuário é cliente
            for (const row of data.slice(1)) { // Ignora a primeira linha (cabeçalhos)
                console.log(`Comparando userId: ${userId} com ID Cliente: ${row[1]}`); // Log de comparação
                if (row[1].toString() === userId && (row[7] === 'PIX Gerado' || row[7] === '')) { // Coluna B é o ID do chat e a coluna H é o status
                    isClient = true;
                    break;
                }
            }

            if (isClient) {
                console.log("Usuário encontrado. Enviando mensagem de boas-vindas."); // Log de sucesso
                await enviarMensagemDeBoasVindas2(ctx);
            } else {
                console.log("Usuário não encontrado ou status não é 'PIX Gerado'."); // Log de erro
            }
        } else {
            console.error("Dados inesperados recebidos:", response.data);
        }
    } catch (error) {
        console.error("Erro ao consultar Google Sheets:", error);
        ctx.reply("Houve um erro ao processar sua solicitação."); // Mensagem de erro para o usuário
    }
}

// Enviar mensagem de boas vindas depois de 12 hrs
async function enviarMensagemDeBoasVindas2(ctx) {
	await limparMensagens(ctx, '5');
	 
	const bemVindo2Message = await ctx.reply(
		`Bem\\-vindo ❤\n` +
        `Nos meus conteúdos eu passo meu Whats pra gente conversar e até trocar nudes de vez em quando \\(se você quiser\\)\n\n` +
        `Você vai ver todos meus vídeos transando, fazendo garganta profunda, me masturbando até gozar bem gostoso, além dos vídeos socando bem forte no meu cuzinho, TUDO o que você imaginar\n\n` +
        `Você vem\\?\\? 😈👇🏻`, 
			{
        parse_mode: 'MarkdownV2'
        });
		
	bemVindo2MessageIds[`${ctx.chat.id}-bemVindo2`] = bemVindo2Message.message_id;
	
    const mensagem = `Não tem acesso aos meus conteúdos exclusivos ainda?? Não fique de fora e aproveite essa oportunidade!!`;

    // Envia a mensagem de boas-vindas
    const oportunidadeMessage = await ctx.reply(mensagem, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'EU QUERO', callback_data: 'iniciar_bot2' }]
            ]
        }
    });
		// Armazena o ID da mensagem para deletar depois, usando `chat.id` como chave
		oportunidadeMessageIds[`${ctx.chat.id}-oportunidade`] = oportunidadeMessage.message_id;

		setTimeout(() => consultarUsuario(ctx), 12 * 60 * 60 * 1000); // 12 horas em milissegundos
    

    
}

// Tratar o callback do botão "EU QUERO"
bot.action('iniciar_bot2', async (ctx) => {
    await limparMensagens(ctx, '5');
	const bemVindo2Message = await ctx.reply(
		`Bem\\-vindo ❤\n` +
        `Nos meus conteúdos eu passo meu Whats pra gente conversar e até trocar nudes de vez em quando \\(se você quiser\\)\n\n` +
        `Você vai ver todos meus vídeos transando, fazendo garganta profunda, me masturbando até gozar bem gostoso, além dos vídeos socando bem forte no meu cuzinho, TUDO o que você imaginar\n\n` +
        `Você vem\\?\\? 😈👇🏻`, 
			{
        parse_mode: 'MarkdownV2'
        });
		bemVindo2MessageIds[`${ctx.chat.id}-bemVindo2`] = bemVindo2Message.message_id;
		
	const oportunidade2Message = await ctx.reply(
		`Não tem acesso aos meus conteúdos exclusivos ainda\\?\\? Não fique de fora e aproveite essa oportunidade\\!\\!`, 
			{
        parse_mode: 'MarkdownV2'
        });
		oportunidade2MessageIds[`${ctx.chat.id}-opoertunidade2`] = oportunidade2Message.message_id;
	
    // Chamar o fluxo de conteúdo aqui
    await iniciarFluxoDeConteudo(ctx);
});

// FUNÇÕES PARA LIMPAR MENSAGENS
async function limparMensagens(ctx, tipo) {
    
            const deleteMessages = async (ids) => {
                for (const id of ids) {
                    if (id) {
                        await ctx.deleteMessage(id);
                    } else { }
                }
            };

		switch (tipo) {
        case '1':
		await deleteMessages([
		// mensagemInicialMessageIds[`${ctx.chat.id}-MensagemInicial`], // Oi...
		// luxuriaMessageIds[`${ctx.chat.id}-luxuria`], // Esse é o pacote luxuria...
		// fantasiaMessageIds[`${ctx.chat.id}-fantasia`], // Esse é o pacote fantasia...
		// feitiçoMessageIds[`${ctx.chat.id}-feitiço`], // Esse é o pacote feitiço...
		// toEsperandoMessageIds[`${ctx.chat.id}-toEsperando`], // To esperando...
	    // paymentChoiceMessageIds[`${ctx.chat.id}-paymentChoice`], // Escolha a forma de pagamento
		generatingPaymentMessageIds[`${ctx.chat.id}-generatingPayment`], // Gerando pagamento com Pix...
        generatingMessageIds[`${ctx.chat.id}-generating`], // Gerando pagamento com cartao...
		// generatingCheckoutMessageIds[`${ctx.chat.id}-generatingCheckout`], // Chekout para cartao de credito
		successPaymentMessageIds[`${ctx.chat.id}-successPayment`], // Pagamento gerado com sucesso
        qrCodeMessageIds[`${ctx.chat.id}-qrcode`], // qrcode pix
        jaPagouMessageIds[`${ctx.chat.id}-jaPagou`], // Já pagou?
		verificationMessageIds[`${ctx.chat.id}-verification`], // Verificando...
		verificarNovamenteMessageIds[`${ctx.chat.id}-verificarNovamente`], // Verificar novamente
		// vique1MessageIds[`${ctx.chat.id}-vique1`], // Vi que gerou um pix
		// vique2MessageIds[`${ctx.chat.id}-vique2`], // Quer desconto? com botão
		// vique3MessageIds[`${ctx.chat.id}-vique3`], // Quer desconto? sem botão
		// desc1MessageIds[`${ctx.chat.id}-desc1`], // Oferta desconto
		desc2MessageIds[`${ctx.chat.id}-desc2`] // Desconto com botão
		// desc3MessageIds[`${ctx.chat.id}-desc3`], // Desconto sem botão
		// bemVindoMessageIds[`${ctx.chat.id}-bemVindo`], // Bem vindo...
		// oportunidadeMessageIds[`${ctx.chat.id}-oportunidade`], // Oportunidade
		// upsellMessageIds[`${ctx.chat.id}-upsell`] //Upsell
		
		]);

		// Limpar os IDs das mensagens
	
		// delete mensagemInicialMessageIds[`${ctx.chat.id}-MensagemInicial`]; // Oii
		// delete luxuriaMessageIds[`${ctx.chat.id}-luxuria`]; // Esse é o pacote luxuria...
		// delete fantasiaMessageIds[`${ctx.chat.id}-fantasia`]; // Esse é o pacote fantasia...
		// delete feitiçoMessageIds[`${ctx.chat.id}-feitiço`]; // Esse é o pacote feitiço...
		// delete toEsperandoMessageIds[`${ctx.chat.id}-toEsperando`], // To te esperando...
		// delete paymentChoiceMessageIds[`${ctx.chat.id}-paymentChoice`]; // Escolha a forma de pagamento
		delete generatingPaymentMessageIds[`${ctx.chat.id}-generatingPayment`], // Gerando pagamento com Pix...
		delete generatingMessageIds[`${ctx.chat.id}-generating`]; // Gerando pagamento com cartao...
		// delete generatingCheckoutMessageIds[`${ctx.chat.id}-generatingCheckout`]; // Chekout para cartao de credito
		delete successPaymentMessageIds[`${ctx.chat.id}-successPayment`]; // Pagamento gerado com sucesso
		delete qrCodeMessageIds[`${ctx.chat.id}-qrcode`]; // qrcode pix
		delete jaPagouMessageIds[`${ctx.chat.id}-jaPagou`];// Já pagou?
		delete verificationMessageIds[`${ctx.chat.id}-verification`]; // Verificando...
		delete verificarNovamenteMessageIds[`${ctx.chat.id}-verificarNovamente`]; // Verificar novamente
		// delete vique1MessageIds[`${ctx.chat.id}-vique1`]; // Vi que gerou um pix
        // delete vique2MessageIds[`${ctx.chat.id}-vique2`]; // Quer desconto? com botão 
		// delete vique3MessageIds[`${ctx.chat.id}-vique3`]; // Quer desconto? sem botão
		// delete desc1MessageIds[`${ctx.chat.id}-desc1`]; // Oferta desconto
		delete desc2MessageIds[`${ctx.chat.id}-desc2`]; // Desconto com botão
		// delete desc3MessageIds[`${ctx.chat.id}-desc3`]; // Desconto sem botão
		// delete bemVindoMessageIds[`${ctx.chat.id}-bemVindo`]; // Bem vindo...
		// delete oportunidadeMessageIds[`${ctx.chat.id}-oportunidade`]; // Oportunidade
		// delete upsellMessageIds[`${ctx.chat.id}-upsell`]; //Upsell
		
		break;


        case '2':
		await deleteMessages([
		// mensagemInicialMessageIds[`${ctx.chat.id}-MensagemInicial`], // Oi...
		// luxuriaMessageIds[`${ctx.chat.id}-luxuria`], // Esse é o pacote luxuria...
		// fantasiaMessageIds[`${ctx.chat.id}-fantasia`], // Esse é o pacote fantasia...
		// feitiçoMessageIds[`${ctx.chat.id}-feitiço`], // Esse é o pacote feitiço...
		// toEsperandoMessageIds[`${ctx.chat.id}-toEsperando`], // To esperando...
	    paymentChoiceMessageIds[`${ctx.chat.id}-paymentChoice`], // Escolha a forma de pagamento
		generatingPaymentMessageIds[`${ctx.chat.id}-generatingPayment`], // Gerando pagamento com Pix...
        generatingMessageIds[`${ctx.chat.id}-generating`], // Gerando pagamento com cartao...
		generatingCheckoutMessageIds[`${ctx.chat.id}-generatingCheckout`], // Chekout para cartao de credito
		successPaymentMessageIds[`${ctx.chat.id}-successPayment`], // Pagamento gerado com sucesso
        qrCodeMessageIds[`${ctx.chat.id}-qrcode`], // qrcode pix
        jaPagouMessageIds[`${ctx.chat.id}-jaPagou`], // Já pagou?
		verificationMessageIds[`${ctx.chat.id}-verification`], // Verificando...
		verificarNovamenteMessageIds[`${ctx.chat.id}-verificarNovamente`] // Verificar novamente
		// vique1MessageIds[`${ctx.chat.id}-vique1`], // Vi que gerou um pix
		// vique2MessageIds[`${ctx.chat.id}-vique2`], // Quer desconto? com botão
		// vique3MessageIds[`${ctx.chat.id}-vique3`], // Quer desconto? sem botão
		// desc1MessageIds[`${ctx.chat.id}-desc1`], // Oferta desconto
		// desc2MessageIds[`${ctx.chat.id}-desc2`], // Desconto com botão
		// desc3MessageIds[`${ctx.chat.id}-desc3`], // Desconto sem botão
		// bemVindoMessageIds[`${ctx.chat.id}-bemVindo`], // Bem vindo...
		// oportunidadeMessageIds[`${ctx.chat.id}-oportunidade`], // Oportunidade
		// upsellMessageIds[`${ctx.chat.id}-upsell`] //Upsell
		
		]);

		// Limpar os IDs das mensagens
	
		// delete mensagemInicialMessageIds[`${ctx.chat.id}-MensagemInicial`]; // Oii
		// delete luxuriaMessageIds[`${ctx.chat.id}-luxuria`]; // Esse é o pacote luxuria...
		// delete fantasiaMessageIds[`${ctx.chat.id}-fantasia`]; // Esse é o pacote fantasia...
		// delete feitiçoMessageIds[`${ctx.chat.id}-feitiço`]; // Esse é o pacote feitiço...
		// delete toEsperandoMessageIds[`${ctx.chat.id}-toEsperando`], // To te esperando...
		delete paymentChoiceMessageIds[`${ctx.chat.id}-paymentChoice`]; // Escolha a forma de pagamento
		delete generatingPaymentMessageIds[`${ctx.chat.id}-generatingPayment`], // Gerando pagamento com Pix...
		delete generatingMessageIds[`${ctx.chat.id}-generating`]; // Gerando pagamento com cartao...
		delete generatingCheckoutMessageIds[`${ctx.chat.id}-generatingCheckout`]; // Chekout para cartao de credito
		delete successPaymentMessageIds[`${ctx.chat.id}-successPayment`]; // Pagamento gerado com sucesso
		delete qrCodeMessageIds[`${ctx.chat.id}-qrcode`]; // qrcode pix
		delete jaPagouMessageIds[`${ctx.chat.id}-jaPagou`];// Já pagou?
		delete verificationMessageIds[`${ctx.chat.id}-verification`]; // Verificando...
		delete verificarNovamenteMessageIds[`${ctx.chat.id}-verificarNovamente`]; // Verificar novamente
		// delete vique1MessageIds[`${ctx.chat.id}-vique1`]; // Vi que gerou um pix
        // delete vique2MessageIds[`${ctx.chat.id}-vique2`]; // Quer desconto? com botão
		// delete vique3MessageIds[`${ctx.chat.id}-vique3`]; // Quer desconto? sem botão
		// delete desc1MessageIds[`${ctx.chat.id}-desc1`]; // Oferta desconto
		// delete desc2MessageIds[`${ctx.chat.id}-desc2`]; // Desconto com botão
		// delete desc3MessageIds[`${ctx.chat.id}-desc3`]; // Desconto sem botão
		// delete bemVindoMessageIds[`${ctx.chat.id}-bemVindo`]; // Bem vindo...
		// delete oportunidadeMessageIds[`${ctx.chat.id}-oportunidade`]; // Oportunidade
		// delete upsellMessageIds[`${ctx.chat.id}-upsell`] //Upsell
		
		
		break;


        case '3':
		await deleteMessages([
		// mensagemInicialMessageIds[`${ctx.chat.id}-MensagemInicial`], // Oi...
		// luxuriaMessageIds[`${ctx.chat.id}-luxuria`], // Esse é o pacote luxuria...
		// fantasiaMessageIds[`${ctx.chat.id}-fantasia`], // Esse é o pacote fantasia...
		// feitiçoMessageIds[`${ctx.chat.id}-feitiço`], // Esse é o pacote feitiço...
		// toEsperandoMessageIds[`${ctx.chat.id}-toEsperando`], // To esperando...
	    paymentChoiceMessageIds[`${ctx.chat.id}-paymentChoice`], // Escolha a forma de pagamento
		generatingPaymentMessageIds[`${ctx.chat.id}-generatingPayment`], // Gerando pagamento com Pix...
        generatingMessageIds[`${ctx.chat.id}-generating`], // Gerando pagamento com cartao...
		generatingCheckoutMessageIds[`${ctx.chat.id}-generatingCheckout`], // Chekout para cartao de credito
		successPaymentMessageIds[`${ctx.chat.id}-successPayment`], // Pagamento gerado com sucesso
        qrCodeMessageIds[`${ctx.chat.id}-qrcode`], // qrcode pix
        jaPagouMessageIds[`${ctx.chat.id}-jaPagou`], // Já pagou?
		verificationMessageIds[`${ctx.chat.id}-verification`], // Verificando...
		verificarNovamenteMessageIds[`${ctx.chat.id}-verificarNovamente`], // Verificar novamente
		vique1MessageIds[`${ctx.chat.id}-vique1`], // Vi que gerou um pix
		vique2MessageIds[`${ctx.chat.id}-vique2`], // Quer desconto? com botão
		// vique3MessageIds[`${ctx.chat.id}-vique3`], // Quer desconto? sem botão
		desc1MessageIds[`${ctx.chat.id}-desc1`], // Oferta desconto
		desc2MessageIds[`${ctx.chat.id}-desc2`] // Desconto com botão
		// desc3MessageIds[`${ctx.chat.id}-desc3`], // Desconto sem botão
		// bemVindoMessageIds[`${ctx.chat.id}-bemVindo`], // Bem vindo...
		// oportunidadeMessageIds[`${ctx.chat.id}-oportunidade`], // Oportunidade
		// upsellMessageIds[`${ctx.chat.id}-upsell`] //Upsell
		
		]);

		// Limpar os IDs das mensagens
	
		// delete mensagemInicialMessageIds[`${ctx.chat.id}-MensagemInicial`]; // Oii
		// delete luxuriaMessageIds[`${ctx.chat.id}-luxuria`]; // Esse é o pacote luxuria...
		// delete fantasiaMessageIds[`${ctx.chat.id}-fantasia`]; // Esse é o pacote fantasia...
		// delete feitiçoMessageIds[`${ctx.chat.id}-feitiço`]; // Esse é o pacote feitiço...
		// delete toEsperandoMessageIds[`${ctx.chat.id}-toEsperando`], // To te esperando...
		delete paymentChoiceMessageIds[`${ctx.chat.id}-paymentChoice`]; // Escolha a forma de pagamento
		delete generatingPaymentMessageIds[`${ctx.chat.id}-generatingPayment`], // Gerando pagamento com Pix...
		delete generatingMessageIds[`${ctx.chat.id}-generating`]; // Gerando pagamento com cartao...
		delete generatingCheckoutMessageIds[`${ctx.chat.id}-generatingCheckout`]; // Chekout para cartao de credito
		delete successPaymentMessageIds[`${ctx.chat.id}-successPayment`]; // Pagamento gerado com sucesso
		delete qrCodeMessageIds[`${ctx.chat.id}-qrcode`]; // qrcode pix
		delete jaPagouMessageIds[`${ctx.chat.id}-jaPagou`];// Já pagou?
		delete verificationMessageIds[`${ctx.chat.id}-verification`]; // Verificando...
		delete verificarNovamenteMessageIds[`${ctx.chat.id}-verificarNovamente`]; // Verificar novamente
		delete vique1MessageIds[`${ctx.chat.id}-vique1`]; // Vi que gerou um pix
        delete vique2MessageIds[`${ctx.chat.id}-vique2`]; // Quer desconto? com botão
		delete vique3MessageIds[`${ctx.chat.id}-vique3`]; // Quer desconto? sem botão
		delete desc1MessageIds[`${ctx.chat.id}-desc1`]; // Oferta desconto
		delete desc2MessageIds[`${ctx.chat.id}-desc2`]; // Desconto com botão
		// delete desc3MessageIds[`${ctx.chat.id}-desc3`]; // Desconto sem botão
		// delete bemVindoMessageIds[`${ctx.chat.id}-bemVindo`]; // Bem vindo...
		// delete oportunidadeMessageIds[`${ctx.chat.id}-oportunidade`]; // Oportunidade...
		// delete upsellMessageIds[`${ctx.chat.id}-upsell`]; // Upsell...
								
		break;

        case '4':
		await deleteMessages([
		// mensagemInicialMessageIds[`${ctx.chat.id}-MensagemInicial`], // Oi...
		// luxuriaMessageIds[`${ctx.chat.id}-luxuria`], // Esse é o pacote luxuria...
		// fantasiaMessageIds[`${ctx.chat.id}-fantasia`], // Esse é o pacote fantasia...
		// feitiçoMessageIds[`${ctx.chat.id}-feitiço`], // Esse é o pacote feitiço...
		// toEsperandoMessageIds[`${ctx.chat.id}-toEsperando`], // To esperando...
	    paymentChoiceMessageIds[`${ctx.chat.id}-paymentChoice`], // Escolha a forma de pagamento
		// generatingPaymentMessageIds[`${ctx.chat.id}-generatingPayment`], // Gerando pagamento com Pix...
        // generatingMessageIds[`${ctx.chat.id}-generating`], // Gerando pagamento com cartao...
		// generatingCheckoutMessageIds[`${ctx.chat.id}-generatingCheckout`], // Chekout para cartao de credito
		// successPaymentMessageIds[`${ctx.chat.id}-successPayment`], // Pagamento gerado com sucesso
        // qrCodeMessageIds[`${ctx.chat.id}-qrcode`], // qrcode pix
        // jaPagouMessageIds[`${ctx.chat.id}-jaPagou`], // Já pagou?
		// verificationMessageIds[`${ctx.chat.id}-verification`], // Verificando...
		// verificarNovamenteMessageIds[`${ctx.chat.id}-verificarNovamente`], // Verificar novamente
		// vique1MessageIds[`${ctx.chat.id}-vique1`], // Vi que gerou um pix
		vique2MessageIds[`${ctx.chat.id}-vique2`], // Quer desconto? com botão 
	    // vique3MessageIds[`${ctx.chat.id}-vique3`] // Quer desconto? sem botão
		// desc1MessageIds[`${ctx.chat.id}-desc1`], // Oferta desconto
		desc2MessageIds[`${ctx.chat.id}-desc2`] // Desconto com botão
		// desc3MessageIds[`${ctx.chat.id}-desc3`], // Desconto sem botão
		// bemVindoMessageIds[`${ctx.chat.id}-bemVindo`], // Bem vindo...
		// oportunidadeMessageIds[`${ctx.chat.id}-oportunidade`], // Oportunidade
		// upsellMessageIds[`${ctx.chat.id}-upsell`] //Upsell
		
		]);

		// Limpar os IDs das mensagens
	
		// delete mensagemInicialMessageIds[`${ctx.chat.id}-MensagemInicial`]; // Oii
		// delete luxuriaMessageIds[`${ctx.chat.id}-luxuria`]; // Esse é o pacote luxuria...
		// delete fantasiaMessageIds[`${ctx.chat.id}-fantasia`]; // Esse é o pacote fantasia...
		// delete feitiçoMessageIds[`${ctx.chat.id}-feitiço`]; // Esse é o pacote feitiço...
		// delete toEsperandoMessageIds[`${ctx.chat.id}-toEsperando`], // To te esperando...
		delete paymentChoiceMessageIds[`${ctx.chat.id}-paymentChoice`]; // Escolha a forma de pagamento
		// delete generatingPaymentMessageIds[`${ctx.chat.id}-generatingPayment`], // Gerando pagamento com Pix...
		// delete generatingMessageIds[`${ctx.chat.id}-generating`]; // Gerando pagamento com cartao...
		// delete generatingCheckoutMessageIds[`${ctx.chat.id}-generatingCheckout`]; // Chekout para cartao de credito
		// delete successPaymentMessageIds[`${ctx.chat.id}-successPayment`]; // Pagamento gerado com sucesso
		// delete qrCodeMessageIds[`${ctx.chat.id}-qrcode`]; // qrcode pix
		// delete jaPagouMessageIds[`${ctx.chat.id}-jaPagou`];// Já pagou?
		// delete verificationMessageIds[`${ctx.chat.id}-verification`]; // Verificando...
		// delete verificarNovamenteMessageIds[`${ctx.chat.id}-verificarNovamente`]; // Verificar novamente
		// delete vique1MessageIds[`${ctx.chat.id}-vique1`]; // Vi que gerou um pix
        delete vique2MessageIds[`${ctx.chat.id}-vique2`]; // Quer desconto? com botão 
		// delete vique3MessageIds[`${ctx.chat.id}-vique3`]; // Quer desconto? sem botão
		// delete desc1MessageIds[`${ctx.chat.id}-desc1`]; // Oferta desconto
		delete desc2MessageIds[`${ctx.chat.id}-desc2`]; // Desconto com botao
		// desc3MessageIds[`${ctx.chat.id}-desc3`]; // Desconto sem botao
		// delete bemVindoMessageIds[`${ctx.chat.id}-bemVindo`]; // Bem vindo...
		// delete oportunidadeMessageIds[`${ctx.chat.id}-oportunidade`]; // Oportunidade...
		// delete upsellMessageIds[`${ctx.chat.id}-upsell`]; // Upsell...
		
		break;

        case '5':
		await deleteMessages([
		mensagemInicialMessageIds[`${ctx.chat.id}-mensagemInicial`], // Oi...
		luxuriaMessageIds[`${ctx.chat.id}-luxuria`], // Esse é o pacote luxuria...
		fantasiaMessageIds[`${ctx.chat.id}-fantasia`], // Esse é o pacote fantasia...
		feitiçoMessageIds[`${ctx.chat.id}-feitiço`], // Esse é o pacote feitiço...
		toEsperandoMessageIds[`${ctx.chat.id}-toEsperando`], // To esperando...
	    paymentChoiceMessageIds[`${ctx.chat.id}-paymentChoice`], // Escolha a forma de pagamento
		generatingPaymentMessageIds[`${ctx.chat.id}-generatingPayment`], // Gerando pagamento com Pix...
        generatingMessageIds[`${ctx.chat.id}-generating`], // Gerando pagamento com cartao...
		generatingCheckoutMessageIds[`${ctx.chat.id}-generatingCheckout`], // Chekout para cartao de credito
		successPaymentMessageIds[`${ctx.chat.id}-successPayment`], // Pagamento gerado com sucesso
        qrCodeMessageIds[`${ctx.chat.id}-qrcode`], // qrcode pix
        jaPagouMessageIds[`${ctx.chat.id}-jaPagou`], // Já pagou?
		verificationMessageIds[`${ctx.chat.id}-verification`], // Verificando...
		verificarNovamenteMessageIds[`${ctx.chat.id}-verificarNovamente`], // Verificar novamente
		vique1MessageIds[`${ctx.chat.id}-vique1`], // Vi que gerou um pix
		vique2MessageIds[`${ctx.chat.id}-vique2`], // Quer desconto? com botão
		vique3MessageIds[`${ctx.chat.id}-vique3`], // Quer desconto? sem botão
		desc1MessageIds[`${ctx.chat.id}-desc1`], // Oferta desconto
		desc2MessageIds[`${ctx.chat.id}-desc2`], // Desconto com botão
		desc3MessageIds[`${ctx.chat.id}-desc3`], // Desconto sem botão
		bemVindoMessageIds[`${ctx.chat.id}-bemVindo`], // Bem vindo... com botão
		bemVindo2MessageIds[`${ctx.chat.id}-bemVindo2`], // Bem vindo... sem botão
		oportunidadeMessageIds[`${ctx.chat.id}-oportunidade`], // Oportunidade com botão
		oportunidade2MessageIds[`${ctx.chat.id}-oportunidade2`], // Oportunidade sem botão
		upsellMessageIds[`${ctx.chat.id}-upsell`] //Upsell
		
		]);

		// Limpar os IDs das mensagens
	
		delete mensagemInicialMessageIds[`${ctx.chat.id}-mensagemInicial`]; // Oii
		delete luxuriaMessageIds[`${ctx.chat.id}-luxuria`]; // Esse é o pacote luxuria...
		delete fantasiaMessageIds[`${ctx.chat.id}-fantasia`]; // Esse é o pacote fantasia...
		delete feitiçoMessageIds[`${ctx.chat.id}-feitiço`]; // Esse é o pacote feitiço...
		delete toEsperandoMessageIds[`${ctx.chat.id}-toEsperando`], // To te esperando...
		delete paymentChoiceMessageIds[`${ctx.chat.id}-paymentChoice`]; // Escolha a forma de pagamento
		delete generatingPaymentMessageIds[`${ctx.chat.id}-generatingPayment`], // Gerando pagamento com Pix...
		delete generatingMessageIds[`${ctx.chat.id}-generating`]; // Gerando pagamento com cartao...
		delete generatingCheckoutMessageIds[`${ctx.chat.id}-generatingCheckout`]; // Chekout para cartao de credito
		delete successPaymentMessageIds[`${ctx.chat.id}-successPayment`]; // Pagamento gerado com sucesso
		delete qrCodeMessageIds[`${ctx.chat.id}-qrcode`]; // qrcode pix
		delete jaPagouMessageIds[`${ctx.chat.id}-jaPagou`];// Já pagou?
		delete verificationMessageIds[`${ctx.chat.id}-verification`]; // Verificando...
		delete verificarNovamenteMessageIds[`${ctx.chat.id}-verificarNovamente`]; // Verificar novamente
		delete vique1MessageIds[`${ctx.chat.id}-vique1`]; // Vi que gerou um pix
		delete vique2MessageIds[`${ctx.chat.id}-vique2`]; // Quer desconto? com botão
		delete vique3MessageIds[`${ctx.chat.id}-vique3`]; // Quer desconto? sem botão
		delete desc1MessageIds[`${ctx.chat.id}-desc1`]; // Oferta desconto
		delete desc2MessageIds[`${ctx.chat.id}-desc2`]; // Desconto com botão
		delete desc3MessageIds[`${ctx.chat.id}-desc3`]; // Desconto sem botão
		delete bemVindoMessageIds[`${ctx.chat.id}-bemVindo`]; // Bem vindo... com botão
		delete bemVindo2MessageIds[`${ctx.chat.id}-bemVindo2`]; // Bem vindo... sem botão
		delete oportunidadeMessageIds[`${ctx.chat.id}-oportunidade`]; // Oportunidade...
		delete oportunidade2MessageIds[`${ctx.chat.id}-oportunidade2`]; // Oportunidade...
		delete upsellMessageIds[`${ctx.chat.id}-upsell`]; // Upsell...
		
		break;

        default:
            console.log(`Tipo de mensagem desconhecido: ${tipo}`);
            break;
}


}

// Aguardando o nome do bot
obterNomeBot();
bot.launch();
console.log('Bot em execução...');
