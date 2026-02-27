<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    exit(json_encode(['success' => false, 'message' => 'Método não permitido']));
}

$input = json_decode(file_get_contents('php://input'), true);
$email = $input['email'] ?? '';
$senha = $input['senha'] ?? '';

// SUA STRING DE CONEXÃO MySQL
$dsn = 'mysql://root:ClAtlSGJbFbQRVCUNAFEUffcghUPoodk@switchyard.proxy.rlwy.net:27177/railway';
$dsn_parts = parse_url($dsn);
$host = $dsn_parts['host'];
$port = $dsn_parts['port'];
$dbname = str_replace('/', '', $dsn_parts['path']);
$username = explode(':', $dsn_parts['user'])[0];
$password = $dsn_parts['pass'];

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $pdo->prepare("SELECT email FROM SF_USUARIO WHERE email = ? AND senha = ?");
    $stmt->execute([$email, $senha]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Login válido']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Email ou senha incorretos']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erro no banco: ' . $e->getMessage()]);
}
?>
