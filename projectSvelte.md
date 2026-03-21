

**Gestionnaire de to-do list :**

Il s'agit de réaliser, avec stockage dans la base de données du navigateur, un générateur/archiveur de liste de cases à cocher. 

Chaque liste est caractérisée par un nombre _a priori_ indéterminé d'items, et peut comporter des sous-listes, chaque sous-liste pouvant elle aussi contenir des sous-sous-listes, _etc_. 

L'application permet de parcourir les listes déjà créées, de les modifier, les dupliquer, les supprimer mais aussi d'en créer une nouvelle. 

Chaque liste doit être accessible via un URI distinct.

---
Fonctionnalistes : 

-> criar novas listas 
-> criar sub listas 
-> criar to do
-> addicionar e criar tags
-> marcar e desmarcar 
-> mostrar ou esconder as ja feitas
-> login 


 a decidir : 
 
-> atribuir a tache a  algem 
-> progressao das taches


---
Obs : 

-> tache: titilo, notas, data, tags, hora. tag prioridade (code cor - vermelho, amarelo, etc )
-> lista : titilo, tag. 
-> A base de nonnes tem que ser o local Storage ou Session Storage:

https://bootswatch.com

https://bootswatch.com/litera/


admin@admin.com


---

## localStorageService.js
Gerencia o armazenamento local dos dados da aplicação usando localStorage. Fornece funções para criar a estrutura padrão do banco local, carregar, salvar e limpar os dados persistidos. A estrutura salva inclui lists, tags e version.
Onde é usado: importado em listsStore.js para carregar e persistir as listas.

## ProtectedRoute.svelte
Componente de rota protegida para svelte-routing. Enquanto o estado de autenticação está carregando, exibe um spinner. Se não houver usuário autenticado, redireciona para "/"; caso exista usuário, renderiza a rota protegida.
Onde é usado: em App.svelte, protegendo as rotas /home, /list, /list/:id e /profile/:id.

## authStore.js
Centraliza o estado de autenticação da aplicação com as stores user e isLoading, além das funções initAuth() e logout(). Usa o Supabase para obter a sessão atual, reagir a mudanças de autenticação e encerrar a sessão do usuário.
Onde é usado: importado em ProtectedRoute.svelte e App.svelte.

## supabaseClient.js
Cria e exporta o cliente Supabase configurado com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY. Esse cliente permite a comunicação da aplicação com o Supabase; no código verificado, ele é usado para autenticação.
Onde é usado: importado em authStore.js.
Caminho correto no projeto: src/lib/auth/supabaseClient.js.

## listsStore.js
Define um store customizado de Svelte para gerenciar listas e sublistas de tarefas. Centraliza a lógica de normalização, adição, atualização, remoção e substituição de listas, com persistência em localStorage.
Onde é usado: disponível para os componentes e páginas que precisam manipular ou exibir listas; no código verificado, ele depende diretamente de localStorageService.js.