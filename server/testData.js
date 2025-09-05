const { ObjectId } = require('mongodb');

function generateTestData() {
    const now = new Date();
    
    // Tạo các ObjectId để tham chiếu
    const userIds = Array.from({ length: 10 }, () => new ObjectId());
    const locationIds = Array.from({ length: 6 }, () => new ObjectId());
    const incidentIds = Array.from({ length: 5 }, () => new ObjectId());
    const resourceIds = Array.from({ length: 8 }, () => new ObjectId());
    const scenarioIds = Array.from({ length: 4 }, () => new ObjectId());
    const decisionIds = Array.from({ length: 6 }, () => new ObjectId());
    const trainingSessionIds = Array.from({ length: 3 }, () => new ObjectId());

    return {
        users: [
            {
                _id: userIds[0],
                name: 'Đại tá Nguyễn Văn An',
                email: 'commander.nguyen@chtmkt.mil.vn',
                phone: '0901234567',
                role: 'commander',
                rank: 'Đại tá',
                unit: 'Bộ Tư lệnh Tác chiến không gian mạng',
                specialization: ['network_security', 'cyber_defense', 'strategic_planning'],
                permissions: ['read', 'write', 'delete', 'manage', 'command'],
                isActive: true,
                lastLogin: new Date(now - 2 * 60 * 60 * 1000),
                createdAt: new Date(now - 365 * 24 * 60 * 60 * 1000),
                updatedAt: now
            },
            {
                _id: userIds[1],
                name: 'Trung tá Trần Thị Bình',
                email: 'staff.tran@chtmkt.mil.vn',
                phone: '0912345678',
                role: 'staff',
                rank: 'Trung tá',
                unit: 'Phòng Tác chiến Điện tử',
                specialization: ['tactical_planning', 'communication', 'intelligence'],
                permissions: ['read', 'write', 'coordinate'],
                isActive: true,
                lastLogin: new Date(now - 1 * 60 * 60 * 1000),
                createdAt: new Date(now - 300 * 24 * 60 * 60 * 1000),
                updatedAt: now
            },
            {
                _id: userIds[2],
                name: 'Thiếu tá Lê Minh Cường',
                email: 'tech.le@chtmkt.mil.vn',
                phone: '0923456789',
                role: 'technician',
                rank: 'Thiếu tá',
                unit: 'Trung đoàn Thông tin 1',
                specialization: ['network_engineering', 'server_management', 'cybersecurity'],
                permissions: ['read', 'write', 'technical'],
                isActive: true,
                lastLogin: new Date(now - 30 * 60 * 1000),
                createdAt: new Date(now - 200 * 24 * 60 * 60 * 1000),
                updatedAt: now
            },
            {
                _id: userIds[3],
                name: 'Đại úy Phạm Thị Dung',
                email: 'analyst.pham@chtmkt.mil.vn',
                phone: '0934567890',
                role: 'technician',
                rank: 'Đại úy',
                unit: 'Trung tâm Phân tích An ninh mạng',
                specialization: ['threat_analysis', 'incident_response', 'forensics'],
                permissions: ['read', 'write', 'analyze'],
                isActive: true,
                lastLogin: new Date(now - 15 * 60 * 1000),
                createdAt: new Date(now - 150 * 24 * 60 * 60 * 1000),
                updatedAt: now
            },
            {
                _id: userIds[4],
                name: 'Trung úy Hoàng Văn Em',
                email: 'operator.hoang@chtmkt.mil.vn',
                phone: '0945678901',
                role: 'operator',
                rank: 'Trung úy',
                unit: 'Đại đội Giám sát Mạng',
                specialization: ['monitoring', 'alert_management', 'first_response'],
                permissions: ['read', 'monitor'],
                isActive: true,
                lastLogin: new Date(now - 45 * 60 * 1000),
                createdAt: new Date(now - 100 * 24 * 60 * 60 * 1000),
                updatedAt: now
            },
            {
                _id: userIds[5],
                name: 'Thượng tá Vũ Minh Hải',
                email: 'deputy.vu@chtmkt.mil.vn',
                phone: '0956789012',
                role: 'staff',
                rank: 'Thượng tá',
                unit: 'Bộ Tư lệnh Tác chiến không gian mạng',
                specialization: ['operations', 'coordination', 'planning'],
                permissions: ['read', 'write', 'coordinate', 'approve'],
                isActive: true,
                lastLogin: new Date(now - 3 * 60 * 60 * 1000),
                createdAt: new Date(now - 400 * 24 * 60 * 60 * 1000),
                updatedAt: now
            }
        ],

        locations: [
            {
                _id: locationIds[0],
                name: 'Trung tâm Chỉ huy Tác chiến Không gian mạng',
                code: 'HQ-CYBER-001',
                address: 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội',
                coordinates: {
                    latitude: 21.0285,
                    longitude: 105.8542
                },
                type: 'headquarters',
                region: 'north',
                facilityLevel: 'strategic',
                itInfrastructure: {
                    servers: 150,
                    networkNodes: 50,
                    securityLevel: 'classified',
                    criticalSystems: ['command_control', 'intelligence', 'communication', 'cyber_defense']
                },
                contactInfo: {
                    commander: 'Đại tá Nguyễn Văn An',
                    techLead: 'Thiếu tá Lê Minh Cường',
                    phone: '024-38691234',
                    emergencyPhone: '024-38691000'
                },
                isActive: true,
                createdAt: new Date(now - 1000 * 24 * 60 * 60 * 1000),
                updatedAt: now
            },
            {
                _id: locationIds[1],
                name: 'Trung tâm Dữ liệu Quân đội Miền Bắc',
                code: 'DC-NORTH-001',
                address: 'Khu vực Sơn Tây, Hà Nội',
                coordinates: {
                    latitude: 21.1351,
                    longitude: 105.5192
                },
                type: 'datacenter',
                region: 'north',
                facilityLevel: 'operational',
                itInfrastructure: {
                    servers: 500,
                    networkNodes: 100,
                    securityLevel: 'restricted',
                    criticalSystems: ['database', 'backup', 'cloud_services', 'monitoring']
                },
                contactInfo: {
                    commander: 'Trung tá Trần Thị Bình',
                    techLead: 'Đại úy Phạm Thị Dung',
                    phone: '024-33881234',
                    emergencyPhone: '024-33881000'
                },
                isActive: true,
                createdAt: new Date(now - 800 * 24 * 60 * 60 * 1000),
                updatedAt: now
            },
            {
                _id: locationIds[2],
                name: 'Đồn Radar Điện tử Đông Bắc',
                code: 'RADAR-NE-001',
                address: 'Cao Bằng, Việt Nam',
                coordinates: {
                    latitude: 22.6663,
                    longitude: 106.2510
                },
                type: 'field_station',
                region: 'north',
                facilityLevel: 'tactical',
                itInfrastructure: {
                    servers: 20,
                    networkNodes: 15,
                    securityLevel: 'restricted',
                    criticalSystems: ['radar', 'communication', 'early_warning']
                },
                contactInfo: {
                    commander: 'Thiếu tá Nguyễn Văn Đức',
                    techLead: 'Trung úy Hoàng Văn Em',
                    phone: '026-38561234',
                    emergencyPhone: '026-38561000'
                },
                isActive: true,
                createdAt: new Date(now - 600 * 24 * 60 * 60 * 1000),
                updatedAt: now
            },
            {
                _id: locationIds[3],
                name: 'Trung tâm Tác chiến Điện tử Miền Nam',
                code: 'EW-SOUTH-001',
                address: 'Quận 7, TP. Hồ Chí Minh',
                coordinates: {
                    latitude: 10.7769,
                    longitude: 106.7009
                },
                type: 'command_post',
                region: 'south',
                facilityLevel: 'operational',
                itInfrastructure: {
                    servers: 80,
                    networkNodes: 40,
                    securityLevel: 'classified',
                    criticalSystems: ['electronic_warfare', 'signal_intelligence', 'jamming']
                },
                contactInfo: {
                    commander: 'Thượng tá Vũ Minh Hải',
                    techLead: 'Thiếu tá Lê Minh Cường',
                    phone: '028-38771234',
                    emergencyPhone: '028-38771000'
                },
                isActive: true,
                createdAt: new Date(now - 700 * 24 * 60 * 60 * 1000),
                updatedAt: now
            }
        ],

        incidents: [
            {
                _id: incidentIds[0],
                incidentCode: 'CYBER-2025-001',
                title: 'Tấn công DDoS quy mô lớn vào hệ thống chỉ huy',
                description: 'Phát hiện cuộc tấn công DDoS có quy mô lớn nhằm vào hệ thống mạng chỉ huy chính, gây gián đoạn nghiêm trọng các hoạt động tác chiến',
                category: 'cyber_attack',
                severity: 'critical',
                priority: 1,
                status: 'in_progress',
                location: locationIds[0],
                affectedSystems: ['command_control', 'communication', 'intelligence'],
                reportedBy: userIds[4],
                assignedTo: [userIds[2], userIds[3]],
                commander: userIds[0],
                estimatedDowntime: 240,
                actualDowntime: null,
                businessImpact: 'critical',
                rootCause: 'Advanced Persistent Threat (APT) attack',
                timeline: [
                    {
                        timestamp: new Date(now - 4 * 60 * 60 * 1000),
                        action: 'Incident detected by monitoring system',
                        performer: userIds[4],
                        notes: 'Unusual traffic patterns detected'
                    },
                    {
                        timestamp: new Date(now - 3.5 * 60 * 60 * 1000),
                        action: 'Initial assessment completed',
                        performer: userIds[3],
                        notes: 'Confirmed DDoS attack from multiple sources'
                    },
                    {
                        timestamp: new Date(now - 3 * 60 * 60 * 1000),
                        action: 'Emergency response team deployed',
                        performer: userIds[0],
                        notes: 'Full incident response protocol activated'
                    }
                ],
                createdAt: new Date(now - 4 * 60 * 60 * 1000),
                updatedAt: new Date(now - 30 * 60 * 1000),
                resolvedAt: null
            },
            {
                _id: incidentIds[1],
                incidentCode: 'NET-2025-002',
                title: 'Sự cố mất kết nối liên lạc với đồn radar',
                description: 'Mất hoàn toàn kết nối với đồn radar Đông Bắc, không thể nhận được dữ liệu giám sát và cảnh báo sớm',
                category: 'network_failure',
                severity: 'high',
                priority: 2,
                status: 'investigating',
                location: locationIds[2],
                affectedSystems: ['radar', 'communication', 'early_warning'],
                reportedBy: userIds[4],
                assignedTo: [userIds[2]],
                commander: userIds[1],
                estimatedDowntime: 120,
                actualDowntime: null,
                businessImpact: 'high',
                rootCause: 'Under investigation - possible equipment failure',
                timeline: [
                    {
                        timestamp: new Date(now - 2 * 60 * 60 * 1000),
                        action: 'Communication loss detected',
                        performer: userIds[4],
                        notes: 'All communication channels unresponsive'
                    },
                    {
                        timestamp: new Date(now - 1.5 * 60 * 60 * 1000),
                        action: 'Field team dispatched',
                        performer: userIds[1],
                        notes: 'Technical team en route to radar station'
                    }
                ],
                createdAt: new Date(now - 2 * 60 * 60 * 1000),
                updatedAt: new Date(now - 15 * 60 * 1000),
                resolvedAt: null
            },
            {
                _id: incidentIds[2],
                incidentCode: 'SEC-2025-003',
                title: 'Phát hiện hoạt động đáng ngờ trong hệ thống',
                description: 'Hệ thống phát hiện các hoạt động truy cập bất thường vào cơ sở dữ liệu nhạy cảm từ các tài khoản có đặc quyền',
                category: 'security_breach',
                severity: 'high',
                priority: 2,
                status: 'resolved',
                location: locationIds[1],
                affectedSystems: ['database', 'authentication'],
                reportedBy: userIds[3],
                assignedTo: [userIds[3]],
                commander: userIds[5],
                estimatedDowntime: 60,
                actualDowntime: 45,
                businessImpact: 'medium',
                rootCause: 'Compromised admin credentials - resolved with password reset',
                timeline: [
                    {
                        timestamp: new Date(now - 24 * 60 * 60 * 1000),
                        action: 'Suspicious activity detected',
                        performer: userIds[3],
                        notes: 'Unusual database access patterns identified'
                    },
                    {
                        timestamp: new Date(now - 23 * 60 * 60 * 1000),
                        action: 'Security investigation initiated',
                        performer: userIds[3],
                        notes: 'Forensic analysis of access logs'
                    },
                    {
                        timestamp: new Date(now - 22 * 60 * 60 * 1000),
                        action: 'Incident resolved',
                        performer: userIds[3],
                        notes: 'Compromised accounts secured, systems restored'
                    }
                ],
                createdAt: new Date(now - 24 * 60 * 60 * 1000),
                updatedAt: new Date(now - 22 * 60 * 60 * 1000),
                resolvedAt: new Date(now - 22 * 60 * 60 * 1000)
            }
        ],

        resources: [
            {
                _id: resourceIds[0],
                resourceCode: 'MOBILE-CMD-001',
                name: 'Xe chỉ huy lưu động tích hợp',
                type: 'vehicle',
                category: 'mobile_command_unit',
                specifications: {
                    model: 'Command Vehicle MK-7',
                    capacity: '12 operators',
                    communication: ['satellite', 'radio', 'cellular', 'mesh_network'],
                    power: 'diesel_generator_50kW',
                    equipment: ['servers', 'communication_array', 'surveillance_equipment']
                },
                capabilities: ['mobile_command', 'communication_relay', 'field_coordination'],
                status: 'deployed',
                location: locationIds[2],
                assignedTo: incidentIds[1],
                operationalLevel: 'operational',
                maintenanceSchedule: {
                    lastMaintenance: new Date(now - 30 * 24 * 60 * 60 * 1000),
                    nextMaintenance: new Date(now + 60 * 24 * 60 * 60 * 1000),
                    maintenanceType: 'routine'
                },
                deploymentHistory: [
                    {
                        incidentId: incidentIds[1],
                        deployedAt: new Date(now - 1.5 * 60 * 60 * 1000),
                        returnedAt: null,
                        performance: 'excellent'
                    }
                ],
                cost: 50000000,
                createdAt: new Date(now - 500 * 24 * 60 * 60 * 1000),
                updatedAt: new Date(now - 1.5 * 60 * 60 * 1000)
            },
            {
                _id: resourceIds[1],
                resourceCode: 'CYBER-TEAM-ALPHA',
                name: 'Đội ứng cứu sự cố mạng Alpha',
                type: 'personnel',
                category: 'cyber_response_team',
                specifications: {
                    members: 8,
                    specialization: ['incident_response', 'malware_analysis', 'network_forensics', 'threat_hunting'],
                    certification: ['CISSP', 'GCIH', 'GCFA', 'SANS'],
                    experience_years: 12
                },
                capabilities: ['cyber_incident_response', 'digital_forensics', 'threat_analysis', 'system_recovery'],
                status: 'deployed',
                location: locationIds[0],
                assignedTo: incidentIds[0],
                operationalLevel: 'strategic',
                maintenanceSchedule: {
                    lastTraining: new Date(now - 14 * 24 * 60 * 60 * 1000),
                    nextTraining: new Date(now + 16 * 24 * 60 * 60 * 1000),
                    maintenanceType: 'advanced_training'
                },
                deploymentHistory: [
                    {
                        incidentId: incidentIds[0],
                        deployedAt: new Date(now - 3 * 60 * 60 * 1000),
                        returnedAt: null,
                        performance: 'outstanding'
                    }
                ],
                cost: 0,
                createdAt: new Date(now - 365 * 24 * 60 * 60 * 1000),
                updatedAt: new Date(now - 3 * 60 * 60 * 1000)
            },
            {
                _id: resourceIds[2],
                resourceCode: 'FIREWALL-CLUSTER-01',
                name: 'Cụm tường lửa thế hệ mới',
                type: 'hardware',
                category: 'firewall',
                specifications: {
                    model: 'Fortinet FortiGate 3000D',
                    throughput: '100Gbps',
                    concurrent_sessions: '50M',
                    features: ['IPS', 'antivirus', 'web_filtering', 'application_control']
                },
                capabilities: ['network_protection', 'threat_prevention', 'traffic_filtering', 'vpn_gateway'],
                status: 'available',
                location: locationIds[0],
                assignedTo: null,
                operationalLevel: 'strategic',
                maintenanceSchedule: {
                    lastMaintenance: new Date(now - 60 * 24 * 60 * 60 * 1000),
                    nextMaintenance: new Date(now + 30 * 24 * 60 * 60 * 1000),
                    maintenanceType: 'firmware_update'
                },
                deploymentHistory: [],
                cost: 200000000,
                createdAt: new Date(now - 200 * 24 * 60 * 60 * 1000),
                updatedAt: new Date(now - 60 * 24 * 60 * 60 * 1000)
            }
        ],

        decisions: [
            {
                _id: decisionIds[0],
                decisionCode: 'DEC-CYBER-001-2025',
                incidentId: incidentIds[0],
                title: 'Kích hoạt giao thức phòng thủ mạng cấp độ 1',
                description: 'Kích hoạt toàn bộ hệ thống phòng thủ mạng cấp độ cao nhất, cô lập các hệ thống quan trọng và chuyển sang chế độ hoạt động dự phòng',
                type: 'emergency_procedure',
                priority: 'immediate',
                status: 'implemented',
                decisionMaker: userIds[0],
                advisors: [userIds[1], userIds[5]],
                approvedBy: userIds[0],
                affectedLocations: [locationIds[0], locationIds[1]],
                requiredResources: [resourceIds[0], resourceIds[1], resourceIds[2]],
                estimatedCost: 500000000,
                estimatedTime: 60,
                riskAssessment: {
                    level: 'high',
                    factors: ['ongoing_cyber_attack', 'critical_systems_at_risk', 'national_security_implications'],
                    mitigation: 'Immediate isolation and activation of backup systems'
                },
                alternatives: [
                    {
                        option: 'Partial system isolation',
                        pros: ['Lower operational impact', 'Faster implementation'],
                        cons: ['Higher security risk', 'Potential for attack escalation']
                    },
                    {
                        option: 'Continue normal operations with enhanced monitoring',
                        pros: ['No operational disruption', 'Lower cost'],
                        cons: ['High security risk', 'Potential for complete system compromise']
                    }
                ],
                implementationPlan: [
                    {
                        step: 1,
                        action: 'Activate emergency response team',
                        responsible: userIds[0],
                        duration: 5
                    },
                    {
                        step: 2,
                        action: 'Isolate affected network segments',
                        responsible: userIds[2],
                        duration: 15
                    },
                    {
                        step: 3,
                        action: 'Switch to backup communication channels',
                        responsible: userIds[1],
                        duration: 10
                    },
                    {
                        step: 4,
                        action: 'Deploy additional security measures',
                        responsible: userIds[3],
                        duration: 30
                    }
                ],
                timeline: {
                    proposedAt: new Date(now - 3.5 * 60 * 60 * 1000),
                    reviewedAt: new Date(now - 3.3 * 60 * 60 * 1000),
                    approvedAt: new Date(now - 3.2 * 60 * 60 * 1000),
                    implementedAt: new Date(now - 3 * 60 * 60 * 1000),
                    completedAt: null
                },
                createdAt: new Date(now - 3.5 * 60 * 60 * 1000),
                updatedAt: new Date(now - 30 * 60 * 1000)
            }
        ],

        scenarios: [
            {
                _id: scenarioIds[0],
                scenarioCode: 'SCENARIO-CYBER-DEFENSE-001',
                name: 'Diễn tập phòng thủ mạng quốc gia',
                description: 'Kịch bản diễn tập ứng phó với cuộc tấn công mạng quy mô lớn nhằm vào các hệ thống thông tin quan trọng của quốc gia',
                type: 'exercise',
                complexity: 'expert',
                duration: 480,
                objectives: [
                    'Đánh giá khả năng phát hiện và ứng phó với tấn công mạng',
                    'Kiểm tra hiệu quả của quy trình chỉ huy điều hành',
                    'Rèn luyện kỹ năng phối hợp giữa các đơn vị',
                    'Đánh giá khả năng khôi phục hệ thống sau sự cố'
                ],
                participantRoles: [
                    {
                        role: 'commander',
                        count: 2,
                        requirements: ['strategic_planning', 'decision_making', 'leadership']
                    },
                    {
                        role: 'staff',
                        count: 6,
                        requirements: ['tactical_planning', 'coordination', 'communication']
                    },
                    {
                        role: 'technician',
                        count: 12,
                        requirements: ['technical_expertise', 'incident_response', 'system_recovery']
                    },
                    {
                        role: 'operator',
                        count: 8,
                        requirements: ['monitoring', 'alert_management', 'first_response']
                    }
                ],
                locations: [locationIds[0], locationIds[1], locationIds[3]],
                simulatedIncidents: [
                    {
                        incidentType: 'ddos_attack',
                        timing: 30,
                        severity: 'critical',
                        location: locationIds[0],
                        expectedResponse: 'Immediate isolation and mitigation'
                    },
                    {
                        incidentType: 'data_breach',
                        timing: 120,
                        severity: 'high',
                        location: locationIds[1],
                        expectedResponse: 'Forensic investigation and containment'
                    },
                    {
                        incidentType: 'system_compromise',
                        timing: 240,
                        severity: 'critical',
                        location: locationIds[3],
                        expectedResponse: 'Complete system isolation and recovery'
                    }
                ],
                requiredResources: [resourceIds[0], resourceIds[1], resourceIds[2]],
                evaluationCriteria: [
                    {
                        criterion: 'Response Time',
                        weight: 25,
                        measurement: 'Minutes from detection to initial response'
                    },
                    {
                        criterion: 'Decision Quality',
                        weight: 30,
                        measurement: 'Appropriateness of decisions made'
                    },
                    {
                        criterion: 'Communication Effectiveness',
                        weight: 20,
                        measurement: 'Clarity and timeliness of communications'
                    },
                    {
                        criterion: 'System Recovery',
                        weight: 25,
                        measurement: 'Time to restore full operational capability'
                    }
                ],
                phases: [
                    {
                        phase: 'Preparation',
                        duration: 60,
                        activities: ['System setup', 'Participant briefing', 'Equipment check'],
                        milestones: ['All systems operational', 'Participants ready']
                    },
                    {
                        phase: 'Initial Attack',
                        duration: 120,
                        activities: ['Attack simulation', 'Detection testing', 'Initial response'],
                        milestones: ['Attack detected', 'Response initiated']
                    },
                    {
                        phase: 'Escalation',
                        duration: 180,
                        activities: ['Multi-vector attack', 'Command decisions', 'Resource deployment'],
                        milestones: ['Full response activated', 'Systems stabilized']
                    },
                    {
                        phase: 'Recovery',
                        duration: 120,
                        activities: ['System restoration', 'Damage assessment', 'Lessons learned'],
                        milestones: ['Systems restored', 'Exercise completed']
                    }
                ],
                status: 'scheduled',
                createdBy: userIds[0],
                approvedBy: userIds[0],
                createdAt: new Date(now - 60 * 24 * 60 * 60 * 1000),
                updatedAt: new Date(now - 30 * 24 * 60 * 60 * 1000),
                scheduledDate: new Date(now + 30 * 24 * 60 * 60 * 1000),
                completedDate: null
            }
        ],

        trainingSessions: [
            {
                _id: trainingSessionIds[0],
                sessionCode: 'TRAIN-CYBER-001-2025',
                title: 'Diễn tập ứng phó tấn công mạng cấp quốc gia',
                scenarioId: scenarioIds[0],
                type: 'exercise',
                status: 'scheduled',
                commander: userIds[0],
                participants: [
                    {
                        userId: userIds[0],
                        role: 'commander',
                        performance: null
                    },
                    {
                        userId: userIds[1],
                        role: 'staff',
                        performance: null
                    },
                    {
                        userId: userIds[2],
                        role: 'technician',
                        performance: null
                    },
                    {
                        userId: userIds[3],
                        role: 'technician',
                        performance: null
                    },
                    {
                        userId: userIds[4],
                        role: 'operator',
                        performance: null
                    }
                ],
                observers: [userIds[5]],
                locations: [locationIds[0], locationIds[1]],
                simulatedIncidents: [incidentIds[0]],
                actualDecisions: [],
                resourcesUsed: [resourceIds[0], resourceIds[1]],
                timeline: [],
                evaluation: null,
                scheduledDate: new Date(now + 30 * 24 * 60 * 60 * 1000),
                actualStartTime: null,
                actualEndTime: null,
                createdAt: new Date(now - 45 * 24 * 60 * 60 * 1000),
                updatedAt: new Date(now - 15 * 24 * 60 * 60 * 1000)
            }
        ],

        logs: [
            {
                _id: new ObjectId(),
                timestamp: new Date(now - 10 * 60 * 1000),
                level: 'CRITICAL',
                source: 'security_system',
                module: 'incident_management',
                action: 'incident_escalated',
                userId: userIds[0],
                targetId: incidentIds[0],
                targetType: 'incident',
                location: locationIds[0],
                message: 'Sự cố mạng được nâng cấp lên mức độ nghiêm trọng',
                details: {
                    oldSeverity: 'high',
                    newSeverity: 'critical',
                    reason: 'Attack volume increased significantly',
                    affectedSystems: ['command_control', 'communication']
                },
                ipAddress: '10.0.1.100',
                userAgent: 'Military-Command-System/2.1',
                sessionId: 'cmd_session_001'
            },
            {
                _id: new ObjectId(),
                timestamp: new Date(now - 25 * 60 * 1000),
                level: 'WARNING',
                source: 'monitoring_system',
                module: 'network_monitoring',
                action: 'anomaly_detected',
                userId: null,
                targetId: locationIds[2],
                targetType: 'location',
                location: locationIds[2],
                message: 'Phát hiện bất thường trong lưu lượng mạng tại đồn radar',
                details: {
                    anomalyType: 'traffic_spike',
                    baseline: '1.2Gbps',
                    current: '15.8Gbps',
                    duration: '15 minutes',
                    source_ips: ['unknown', 'multiple']
                },
                ipAddress: '192.168.100.50',
                userAgent: 'NetworkMonitor/3.2.1',
                sessionId: 'monitor_session_radar_001'
            },
            {
                _id: new ObjectId(),
                timestamp: new Date(now - 1 * 60 * 60 * 1000),
                level: 'INFO',
                source: 'user',
                module: 'authentication',
                action: 'commander_login',
                userId: userIds[0],
                targetId: userIds[0],
                targetType: 'user',
                location: locationIds[0],
                message: 'Chỉ huy cấp cao đăng nhập hệ thống',
                details: {
                    loginMethod: 'military_smart_card',
                    clearanceLevel: 'top_secret',
                    previousLogin: new Date(now - 8 * 60 * 60 * 1000),
                    loginLocation: 'Command Center'
                },
                ipAddress: '10.0.1.10',
                userAgent: 'SecureTerminal/4.0 (Military)',
                sessionId: 'secure_cmd_001'
            },
            {
                _id: new ObjectId(),
                timestamp: new Date(now - 2 * 60 * 60 * 1000),
                level: 'ERROR',
                source: 'system',
                module: 'communication',
                action: 'connection_lost',
                userId: null,
                targetId: locationIds[2],
                targetType: 'location',
                location: locationIds[2],
                message: 'Mất kết nối với đồn radar Đông Bắc',
                details: {
                    lastContact: new Date(now - 2 * 60 * 60 * 1000),
                    connectionType: 'satellite_link',
                    errorCode: 'CONN_TIMEOUT',
                    retryAttempts: 5,
                    backupChannels: 'activated'
                },
                ipAddress: '10.0.2.1',
                userAgent: 'CommunicationSystem/2.5',
                sessionId: 'comm_system_001'
            }
        ]
    };
}

module.exports = {
    generateTestData
};
