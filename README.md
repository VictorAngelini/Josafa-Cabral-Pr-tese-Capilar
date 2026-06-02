<img width="1887" height="947" alt="image" src="https://github.com/user-attachments/assets/513d62c5-523f-49fb-b5ae-18684d7ef36a" />


# Josafá Cabral - Prótese Capilar

Este é o repositório do site oficial para os serviços de prótese capilar do Josafá Cabral. O projeto foi desenvolvido para oferecer uma experiência moderna, permitindo que clientes conheçam o trabalho, vejam resultados e realizem agendamentos online de forma prática.

## Funcionalidades Principais

- **Sistema de Agendamentos Online**: Clientes podem visualizar horários disponíveis e agendar serviços diretamente pelo site.
- **Bloqueio de Datas**: Funcionalidade integrada para gerenciamento e bloqueio de dias e horários específicos na agenda.
- **Galeria de Vídeos e Fotos**: Seção visual atualizada com os resultados dos procedimentos de prótese capilar.
- **Portal do Proprietário**: Área administrativa segura para gerenciamento de horários e controle da agenda.
- **Design Responsivo**: Interface totalmente otimizada para celulares, tablets e computadores.

## Tecnologias Utilizadas

O projeto utiliza tecnologias modernas de desenvolvimento web, incluindo:
- **Banco de Dados**: PostgreSQL (Armazenamento seguro de agendamentos e dados de usuários)
- **Runtime e Linguagem**: Node.js e TypeScript
- **Gerenciamento de pacotes**: PNPM
- **Estrutura**: Workspace modular

## Como Executar o Projeto Localmente

Se quiser rodar o projeto em sua máquina local, siga os passos abaixo:

1. **Clone o repositório**:
   ```bash
   git clone https://github.com
   ```

2. **Configure as Variáveis de Ambiente**:
   Crie um arquivo `.env` na raiz do projeto e adicione a URL de conexão do seu banco de dados PostgreSQL utilizando o modelo abaixo:
   ```env
   DATABASE_URL=postgresql://usuario:senha@host:porta/nome_do_banco
   ```

3. **Instale as dependências**:
   ```bash
   pnpm install
   ```

4. **Inicie o servidor de desenvolvimento**:
   ```bash
   pnpm dev
   ```

---
Desenvolvido por [Victor Angelini](https://github.com).
