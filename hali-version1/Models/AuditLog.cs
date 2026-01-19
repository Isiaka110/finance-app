namespace Hali.Api.Models
{
    public class AuditLog
    {
        public int Id { get; set; }
        public string EntityName { get; set; } = string.Empty; // e.g., "HaliTask"
        public int EntityId { get; set; }
        public string Action { get; set; } = string.Empty; // e.g., "Status Changed"
        public string ChangedBy { get; set; } = string.Empty;
        public string PreviousValue { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}