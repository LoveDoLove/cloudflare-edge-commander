export type Language = "en" | "zh";

export const translations = {
  en: {
    // Navigation & Sidebar
    core_services: "Core Services",
    legal_compliance: "Project & Legal",
    nav_conn: "Connection",
    nav_edge: "Edge Manager",
    nav_lab: "Network Lab",
    nav_tunnels: "Tunnels",
    nav_docs: "DNS Guide",
    nav_about: "About Us",
    nav_privacy: "Privacy Policy",
    nav_terms: "Terms of Service",
    monitor_open: "Process Monitor",
    monitor_close: "Close Monitor",

    // View Titles
    auth_title: "Connectivity & Access",
    infra_title: "Infrastructure Management",
    lab_title: "Network Intelligence Lab",
    tunnels_title: "Tunnel Management Intelligence",
    docs_title: "DNS Reference Registry",
    about_title: "Project Intelligence",
    privacy_title: "Data Sovereignty",
    terms_title: "Service Agreement",

    // Authentication & Accounts
    api_creds: "API Credentials",
    acc_email: "Account Email",
    global_key: "Global API Key",
    establish_session: "Establish Session",
    active_contexts: "Active Contexts",
    awaiting_auth: "Awaiting Auth",
    zone_registry: "Zone Registry",
    add_domain: "Add domain.com...",
    add_btn: "Add",
    select_account: "Select Account First",

    // DNS Management
    dns_registry: "Distributed DNS Registry",
    active_zone: "Active Zone",
    syncing_dns: "Syncing DNS Records...",
    create: "Create",
    proxy: "Proxy",
    registry_empty: "Registry Empty",
    search_placeholder: "Search records...",
    selected_count: "{n} selected",
    confirm_del: "Confirm Deletion",
    del_desc: "Permanently remove this record? This action cannot be reversed.",
    cancel: "Cancel",
    delete: "Delete Record",
    update_done: "Update successful.",
    sync_done: "Sync complete.",

    // Bulk Actions
    bulk_actions: "Bulk Actions",
    bulk_delete: "Bulk Delete",
    bulk_proxy: "Bulk Proxy",
    bulk_unproxy: "Bulk Unproxy",
    confirm_bulk_del: "Bulk Deletion",
    bulk_del_desc:
      "Are you sure you want to delete {n} records? This cannot be undone.",
    processing: "Processing...",

    // SSL & CA
    ca_deploy: "CA Deployment",
    authority: "Authority",
    update_ca: "Update CA",
    enc_layer: "Encryption Layer",
    sec_level: "Security Level",
    enforce_enc: "Enforce Encryption",
    init_context: "Initialize Zone Context",

    // Network Lab
    net_lab: "Network Lab",
    intel_engine: "Intelligence Engine",
    ipv6_block: "IPv6 Address / Block",
    analyze: "Analyze",
    randomize: "Randomize",
    output_reg: "Lab Output Registry",
    system_idle: "System Idle",
    live_logs: "Live Node Logs",
    waiting_events: "Waiting for events...",
    copy_ip: "Copy IP",
    copy_arpa: "Copy ARPA",
    mapping: "Reverse Mapping",
    gen_node: "Generated Node",

    // Status Messages
    success_acc: "Sync Success: {n} accounts found.",
    found_zones: "Found {n} zones.",

    // Task 1: Import/Export
    import_dns: "Import Records",
    export_dns: "Export Records",
    import_success: "Import completed: {s} success, {f} failed",
    import_error: "Invalid file format or parsing error",
    file_placeholder: "Upload CSV or JSON",

    // Task 2: Propagation
    prop_check: "Check Propagation",
    prop_status: "Global DNS Health",

    // Task 3: Tunnel Management
    tunnel_registry: "Cloudflare Tunnel Registry",
    active_tunnels: "Active Edge Tunnels",
    tunnel_status: "Status",
    tunnel_name: "Tunnel Name",
    tunnel_id: "Tunnel ID",
    tunnel_type: "Type",
    tunnel_empty: "No Tunnels detected",
    syncing_tunnels: "Syncing Tunnels...",
    tunnel_connected: "Connected",
    tunnel_inactive: "Inactive",
    tunnel_config: "Tunnel Configuration",
    cidr_routes: "CIDR Routes",
    hostname_routes: "Public Hostnames",
    app_routes: "Access Applications",
    private_network: "Private Network",
    add_route: "Add Route",
    add_hostname: "Add Hostname",
    save_changes: "Save Changes",
    delete_tunnel: "Delete Tunnel",
    tunnel_routes_empty: "No routes configured",
    tunnel_hostnames_empty: "No hostnames configured",
    hostname_label: "Public Hostname",
    service_label: "Service URL",
    add_ingress: "Add Hostname Route",
    service_hint: "e.g., http://localhost:8080",

    // Subnet Lab
    nav_subnet: "Subnet Lab",
    subnet_title: "Subnet Intelligence Lab",
    ip_subnet_block: "IP Address / CIDR",
    calc_subnet: "Calculate",
    subnet_mask: "Subnet Mask",
    network_addr: "Network Address",
    broadcast_addr: "Broadcast Address",
    host_range: "Host Range",
    total_hosts: "Total Hosts",

    // Security
    quick_sec: "Quick Security",
    nuclear_btn: "Under Attack Mode",
    nuclear_desc: "Instantly elevate security level for this zone.",
    nuclear_confirm:
      "INITIATE NUCLEAR PROTOCOL? This will instantly elevate the current zone to 'Under Attack' mode.",
    disable_under_attack: "Disable Layer 7 Defense",
  },
  zh: {
    // 导航与侧边栏
    core_services: "核心服务",
    legal_compliance: "项目与法律",
    nav_conn: "连接设置",
    nav_edge: "边缘管理",
    nav_lab: "网络实验室",
    nav_tunnels: "隧道管理",
    nav_docs: "DNS 指南",
    nav_about: "关于我们",
    nav_privacy: "隐私政策",
    nav_terms: "服务条款",
    monitor_open: "运行监控",
    monitor_close: "关闭监控",

    // 视图标题
    auth_title: "连接与访问控制",
    infra_title: "基础设施管理",
    lab_title: "网络情报实验室",
    tunnels_title: "隧道管理情报中心",
    docs_title: "DNS 参考注册表",
    about_title: "项目情报中心",
    privacy_title: "数据主权声明",
    terms_title: "服务协议",

    // 认证与账号
    api_creds: "API 凭据",
    acc_email: "账号邮箱",
    global_key: "全局 API 密钥",
    establish_session: "建立会话",
    active_contexts: "活跃上下文",
    awaiting_auth: "等待认证",
    zone_registry: "区域注册表",
    add_domain: "添加域名 domain.com...",
    add_btn: "添加",
    select_account: "请先选择账号",

    // DNS 管理
    dns_registry: "分布式 DNS 注册表",
    active_zone: "活跃区域",
    syncing_dns: "正在同步 DNS 记录...",
    create: "创建",
    proxy: "代理",
    registry_empty: "注册表为空",
    search_placeholder: "搜索记录...",
    selected_count: "已选择 {n} 项",
    confirm_del: "确认删除",
    del_desc: "永久移除此记录？此操作无法撤销。",
    cancel: "取消",
    delete: "删除记录",
    update_done: "更新成功。",
    sync_done: "同步完成。",

    // 批量操作
    bulk_actions: "批量操作",
    bulk_delete: "批量删除",
    bulk_proxy: "批量开启代理",
    bulk_unproxy: "批量关闭代理",
    confirm_bulk_del: "确认批量删除",
    bulk_del_desc: "确定要删除 {n} 条记录吗？此操作不可逆。",
    processing: "处理中...",

    // SSL 与 CA
    ca_deploy: "CA 证书部署",
    authority: "证书颁发机构",
    update_ca: "更新 CA",
    enc_layer: "加密层级",
    sec_level: "安全级别",
    enforce_enc: "强制加密",
    init_context: "初始化区域上下文",

    // 网络实验室
    net_lab: "网络实验室",
    intel_engine: "情报引擎",
    ipv6_block: "IPv6 地址 / 网段",
    analyze: "分析",
    randomize: "随机化",
    output_reg: "实验输出注册表",
    system_idle: "系统空闲",
    live_logs: "实时节点日志",
    waiting_events: "等待事件...",
    copy_ip: "复制 IP",
    copy_arpa: "复制 ARPA",
    mapping: "反向映射",
    gen_node: "生成的节点",

    // 状态消息
    success_acc: "同步成功：找到 {n} 个账号。",
    found_zones: "找到 {n} 个区域。",

    // 任务 1：导入/导出
    import_dns: "导入记录",
    export_dns: "导出记录",
    import_success: "导入完成: {s} 成功, {f} 失败",
    import_error: "文件格式错误或解析失败",
    file_placeholder: "上传 CSV 或 JSON",

    // 任务 2：解析检查
    prop_check: "检查解析生效状态",
    prop_status: "全球 DNS 健康度",

    // 任务 3：隧道管理
    tunnel_registry: "Cloudflare 隧道注册表",
    active_tunnels: "活跃边缘隧道",
    tunnel_status: "状态",
    tunnel_name: "隧道名称",
    tunnel_id: "隧道 ID",
    tunnel_type: "类型",
    tunnel_empty: "未检测到隧道",
    syncing_tunnels: "正在同步隧道...",
    tunnel_connected: "已连接",
    tunnel_inactive: "未激活",
    tunnel_config: "隧道配置",
    cidr_routes: "CIDR 路由",
    hostname_routes: "公共主机名",
    app_routes: "Access 应用",
    private_network: "私有网络",
    add_route: "添加路由",
    add_hostname: "添加主机名",
    save_changes: "保存更改",
    delete_tunnel: "删除隧道",
    tunnel_routes_empty: "未配置路由",
    tunnel_hostnames_empty: "未配置主机名",
    hostname_label: "公共主机名",
    service_label: "服务地址",
    add_ingress: "添加主机名路由",
    service_hint: "例如: http://localhost:8080",

    // 子网实验室
    nav_subnet: "子网实验室",
    subnet_title: "子网情报实验室",
    ip_subnet_block: "IP 地址 / CIDR",
    calc_subnet: "计算",
    subnet_mask: "子网掩码",
    network_addr: "网络地址",
    broadcast_addr: "广播地址",
    host_range: "可用主机范围",
    total_hosts: "总主机数",

    // 安全
    quick_sec: "快速安全",
    nuclear_btn: "强力防御模式",
    nuclear_desc: "立即提升当前站点的安全级别。",
    nuclear_confirm:
      "启动核能协议？这将立即把当前站点的安全级别提升至‘强力防御’模式。",
    disable_under_attack: "解除七层防御状态",
  },
};
