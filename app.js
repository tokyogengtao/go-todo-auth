// 1. 初始化 Supabase (请从你的 Supabase 设置中复制这两个值)
const SUPABASE_URL = 'https://vretyaqosmpgdoenlwfl.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_yJ9Z9NR3x9QreGks1dUfGg_Mq44rWXm'
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const authSection = document.getElementById('auth-section')
const todoSection = document.getElementById('todo-section')
const userEmail = document.getElementById('user-email')

// 2. 检查登录状态
async function checkUser() {
    const { data: { user } } = await _supabase.auth.getUser()
    if (user) {
        authSection.classList.add('hidden')
        todoSection.classList.remove('hidden')
        userEmail.innerText = user.email
        fetchTodos() // 登录后获取列表
    }
}

// 3. 登录 & 退出
async function login() {
    await _supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.href }
    })
}

async function logout() {
    await _supabase.auth.signOut()
    location.reload()
}

// 4. 获取当前用户的 Todo (RLS 会确保你只能拿到自己的)
async function fetchTodos() {
    const { data, error } = await _supabase
        .from('todos_v2')
        .select('*')
        .order('created_at', { ascending: false })

    const list = document.getElementById('todoList')
    list.innerHTML = data.map(t => `<li>${t.task}</li>`).join('')
}

// 5. 添加 Todo
async function addTodo() {
    const input = document.getElementById('taskInput')
    if (!input.value) return

    const { error } = await _supabase
        .from('todos_v2')
        .insert([{ task: input.value }]) // user_id 会在后台自动关联

    input.value = ''
    fetchTodos()
}

// 初始化检查
checkUser()