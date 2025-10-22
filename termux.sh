#!/data/data/com.termux/files/usr/bin/bash
# Instalador y lanzador moderno para Legacy-MD
# Código estilo modular por neykoor

BOT_DIR="Legacy-MD"
BOT_REPO="https://github.com/Aqua200/$BOT_DIR"
DB_FILE="database.json"

GREEN='\033[32m'
YELLOW='\033[33m'
BOLD='\033[1m'
RESET='\033[0m'

log() { echo -e "${BOLD}${GREEN}💚 $1${RESET}"; }
warn() { echo -e "${BOLD}${YELLOW}⚠️ $1${RESET}"; }

# ---- Verificar dependencias ----
deps=(git node npm yarn)
for cmd in "${deps[@]}"; do
    if ! command -v "$cmd" &>/dev/null; then
        warn "$cmd no instalado. Instalando..."
        pkg install -y "$cmd"
    fi
done

# ---- Backup automático del database.json ----
backup_db() {
    if [ -f "$HOME/$BOT_DIR/$DB_FILE" ]; then
        timestamp=$(date +"%Y%m%d-%H%M%S")
        backup_file="$HOME/${DB_FILE%.json}_backup_$timestamp.json"
        log "Haciendo backup de $DB_FILE → $backup_file"
        mv "$HOME/$BOT_DIR/$DB_FILE" "$backup_file"
    fi
}

# ---- Clonar o actualizar repositorio ----
update_bot() {
    if [ -d "$HOME/$BOT_DIR/.git" ]; then
        log "Repositorio existente detectado. Actualizando..."
        cd "$HOME/$BOT_DIR" || exit
        git pull
    else
        log "Clonando $BOT_REPO..."
        rm -rf "$HOME/$BOT_DIR"
        git clone "$BOT_REPO" "$HOME/$BOT_DIR"
    fi
}

# ---- Instalar dependencias ----
install_deps() {
    cd "$HOME/$BOT_DIR" || exit
    log "Instalando dependencias..."
    yarn --ignore-scripts
    npm install
}

# ---- Ejecutar bot ----
start_bot() {
    log "🚀 Iniciando Legacy-MD..."
    cd "$HOME/$BOT_DIR" || exit
    npm start
}

# ---- EJECUCIÓN PRINCIPAL ----
cd "$HOME" || exit
backup_db
update_bot
install_deps
start_bot
